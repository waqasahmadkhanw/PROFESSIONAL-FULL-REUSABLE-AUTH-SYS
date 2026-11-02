import mongoose from "mongoose";

import { Contact } from "../models/contact.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const validateMongoId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid MongoDB ID");
  }
};

const createContact = asyncHandler(async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
    throw new ApiError(400, "All fields are required");
  }

  const contact = await Contact.create({
    name: name.trim(),
    email: email.trim().toLowerCase(),
    subject: subject.trim(),
    message: message.trim(),
    ipAddress: req.ip || req.headers["x-forwarded-for"]?.split(",")[0]?.trim(),
  });

  return res.status(201).json(new ApiResponse(201, contact, "Message sent successfully"));
});

const getAllContacts = asyncHandler(async (req, res) => {
  const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 20, 1), 100);
  const skip = (page - 1) * limit;
  const { status } = req.query;

  const query = {};
  if (status && ["new", "read", "replied", "resolved"].includes(status)) {
    query.status = status;
  }

  const contacts = await Contact.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit);
  const total = await Contact.countDocuments(query);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        pagination: { total, page, pages: Math.ceil(total / limit) },
        count: contacts.length,
        contacts,
      },
      "Contacts fetched successfully",
    ),
  );
});

const getContactById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoId(id);

  const contact = await Contact.findById(id);
  if (!contact) {
    throw new ApiError(404, "Contact not found");
  }

  if (contact.status === "new") {
    contact.status = "read";
    await contact.save();
  }

  return res.status(200).json(new ApiResponse(200, contact, "Contact fetched successfully"));
});

const updateContactStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoId(id);

  const { status } = req.body;
  if (!status || !["new", "read", "replied", "resolved"].includes(status)) {
    throw new ApiError(400, "Valid status is required");
  }

  const contact = await Contact.findByIdAndUpdate(id, { status }, { new: true });
  if (!contact) {
    throw new ApiError(404, "Contact not found");
  }

  return res.status(200).json(new ApiResponse(200, contact, "Contact status updated successfully"));
});

const deleteContact = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoId(id);

  const contact = await Contact.findByIdAndDelete(id);
  if (!contact) {
    throw new ApiError(404, "Contact not found");
  }

  return res.status(200).json(new ApiResponse(200, null, "Contact deleted successfully"));
});

export { createContact, getAllContacts, getContactById, updateContactStatus, deleteContact };
