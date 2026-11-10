import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { deleteFromCloudinary } from "../utils/cloudinary.js";
import {
  revokeAllExceptSession,
  revokeAllUserSessions,
  revokeSession,
} from "../service/session.service.js";
import { Session } from "../models/session.model.js";

const getCurrentUser = asyncHandler(async (req, res) => {
  // 1. Get required data from req.body, req.params, or req.query
  // 2. Validate the request data and authorization
  // 3. Perform the required database operation
  // 4. Check the operation result and handle missing data
  // 5. Return the successful API response

  const currentUser = req.user?.toObject?.() ?? req.user;
  currentUser.permissions = req.userPermissions || [];
  return res
    .status(200)
    .json(new ApiResponse(200, currentUser, "Current user fetched successfully"));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  // 1. Get required data from req.body, req.params, or req.query
  // 2. Validate the request data and authorization
  // 3. Perform the required database operation
  // 4. Check the operation result and handle missing data
  // 5. Return the successful API response

  const { name, email } = req.body;
  const normalizedEmail = email?.trim().toLowerCase();
  if (!name?.trim() || !normalizedEmail) throw new ApiError(400, "Name and email are required");

  const exists = await User.findOne({ email: normalizedEmail, _id: { $ne: req.user._id } });
  if (exists) throw new ApiError(409, "Email is already in use");

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: { name: name.trim(), email: normalizedEmail } },
    { new: true, runValidators: true },
  ).select("-password -resetPasswordToken -resetPasswordExpire");

  await revokeAllUserSessions(req.user._id);
  return res.status(200).json(new ApiResponse(200, user, "Account details updated successfully"));
});

const deleteUserAvatar = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) throw new ApiError(404, "User not found");
  if (user.avatarPublicId) await deleteFromCloudinary(user.avatarPublicId).catch(() => {});
  user.avatar = "";
  user.avatarPublicId = "";
  await user.save();
  return res.status(200).json(new ApiResponse(200, {}, "Avatar deleted successfully"));
});

const getActiveSessions = asyncHandler(async (req, res) => {
  const currentSessionId = String(req.authSession?._id || "");
  const sessions = await Session.find({
    user: req.user._id,
    revokedAt: null,
    expiresAt: { $gt: new Date() },
  })
    .sort({ lastUsedAt: -1, createdAt: -1 })
    .select("userAgent ipAddress lastUsedAt createdAt expiresAt revokedAt")
    .lean();

  const data = sessions.map((s) => ({
    id: String(s._id),
    userAgent: s.userAgent || "",
    ipAddress: s.ipAddress || "",
    lastUsedAt: s.lastUsedAt,
    createdAt: s.createdAt,
    expiresAt: s.expiresAt,
    revokedAt: s.revokedAt,
    isCurrent: String(s._id) === currentSessionId,
  }));

  return res.status(200).json(new ApiResponse(200, data, "Active sessions fetched successfully"));
});

const revokeSessionById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) throw new ApiError(400, "Session id is required");
  const result = await revokeSession(id, req.user._id);
  if (!result?.matchedCount && !result?.modifiedCount) {
    throw new ApiError(404, "Session not found");
  }
  return res.status(200).json(new ApiResponse(200, {}, "Session revoked successfully"));
});

const revokeAllExceptCurrent = asyncHandler(async (req, res) => {
  const currentSessionId = req.authSession?._id;
  if (!currentSessionId) throw new ApiError(401, "Authentication required");
  await revokeAllExceptSession(req.user._id, currentSessionId);
  return res.status(200).json(new ApiResponse(200, {}, "Other sessions revoked successfully"));
});

export {
  getCurrentUser,
  updateAccountDetails,
  deleteUserAvatar,
  getActiveSessions,
  revokeSessionById,
  revokeAllExceptCurrent,
};
