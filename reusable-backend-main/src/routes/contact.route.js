import { Router } from "express";

import {
  createContact,
  getAllContacts,
  getContactById,
  updateContactStatus,
  deleteContact,
} from "../controllers/contact.controller.js";
import { authUser, authorizePermission } from "../middlewares/auth.middleware.js";
import { PERMISSIONS } from "../constants/permissions.js";

const router = Router();

// Public route for submitting contact form
router.route("/").post(createContact);

// Admin routes
router.route("/").get(authUser, authorizePermission(PERMISSIONS.MANAGE_SETTINGS), getAllContacts);
router.route("/:id").get(authUser, authorizePermission(PERMISSIONS.MANAGE_SETTINGS), getContactById);
router.route("/:id/status").patch(authUser, authorizePermission(PERMISSIONS.MANAGE_SETTINGS), updateContactStatus);
router.route("/:id").delete(authUser, authorizePermission(PERMISSIONS.MANAGE_SETTINGS), deleteContact);

export default router;
