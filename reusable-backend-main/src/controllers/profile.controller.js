import crypto from "crypto";
import { User } from "../models/user.model.js";
import { Notification } from "../models/notification.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";
import { accessCookieOptions, refreshCookieOptions } from "../utils/Options.js";
import { deleteUserSessions } from "../service/session.service.js";
import EmailService from "../service/email.service.js";
import { logger } from "../utils/logger.js";
import { recordAudit } from "../service/audit.service.js";

const getMyProfile = asyncHandler(async (req, res) => {
  // 1. Get required data from req.body, req.params, or req.query
  // 2. Validate the request data and authorization
  // 3. Perform the required database operation
  // 4. Check the operation result and handle missing data
  // 5. Return the successful API response

  return res.status(200).json(new ApiResponse(200, req.user, "Profile fetched successfully"));
});

const updateProfile = asyncHandler(async (req, res) => {
  // 1. Get required data from req.body, req.params, or req.query
  // 2. Validate the request data and authorization
  // 3. Perform the required database operation
  // 4. Check the operation result and handle missing data
  // 5. Return the successful API response

  const allowed = ["name", "bio", "phone", "profession", "address"];
  const user = await User.findById(req.user._id);
  if (!user) throw new ApiError(404, "User not found");

  for (const field of allowed) if (req.body[field] !== undefined) user[field] = req.body[field];
  await user.save();
  return res.status(200).json(new ApiResponse(200, user, "Profile updated successfully"));
});

const updateSocialLinks = asyncHandler(async (req, res) => {
  // 1. Get required data from req.body, req.params, or req.query
  // 2. Validate the request data and authorization
  // 3. Perform the required database operation
  // 4. Check the operation result and handle missing data
  // 5. Return the successful API response

  const user = await User.findById(req.user._id);
  if (!user) throw new ApiError(404, "User not found");
  for (const field of ["linkedin", "github", "twitter", "website"]) {
    if (req.body[field] !== undefined) user.socials[field] = req.body[field];
  }
  await user.save();
  return res.status(200).json(new ApiResponse(200, user, "Social links updated successfully"));
});

const updateAvatar = asyncHandler(async (req, res) => {
  // 1. Get required data from req.body, req.params, or req.query
  // 2. Validate the request data and authorization
  // 3. Perform the required database operation
  // 4. Check the operation result and handle missing data
  // 5. Return the successful API response

  if (!req.file?.path) throw new ApiError(400, "Avatar file is required");
  const user = await User.findById(req.user._id);
  if (!user) throw new ApiError(404, "User not found");

  const uploaded = await uploadOnCloudinary(req.file.path);
  if (!uploaded) throw new ApiError(500, "Avatar upload failed");

  if (user.avatarPublicId) await deleteFromCloudinary(user.avatarPublicId).catch(() => {});
  user.avatar = uploaded.secure_url || uploaded.url || "";
  user.avatarPublicId = uploaded.public_id || "";
  await user.save();

  return res.status(200).json(new ApiResponse(200, user, "Avatar updated successfully"));
});

const removeAvatar = asyncHandler(async (req, res) => {
  // 1. Get required data from req.body, req.params, or req.query
  // 2. Validate the request data and authorization
  // 3. Perform the required database operation
  // 4. Check the operation result and handle missing data
  // 5. Return the successful API response

  const user = await User.findById(req.user._id);
  if (!user) throw new ApiError(404, "User not found");
  if (user.avatarPublicId) await deleteFromCloudinary(user.avatarPublicId).catch(() => {});
  user.avatar = "";
  user.avatarPublicId = "";
  await user.save();
  return res.status(200).json(new ApiResponse(200, {}, "Avatar removed successfully"));
});

const deleteAccount = asyncHandler(async (req, res) => {
  // Permanent self-service account deletion (irreversible for the user account).
  // Policy: revoke sessions/tokens, anonymize the user record, delete personal
  // notifications, and retain business/financial/audit records (orders, payments,
  // transactions, audit logs) as required. No related business records are deleted.

  const { password, confirm } = req.body ?? {};
  const confirmation = String(confirm || "").trim().toUpperCase();
  if (!password || typeof password !== "string") {
    throw new ApiError(400, "Password is required to delete your account");
  }
  if (confirmation !== "DELETE") {
    throw new ApiError(400, 'Type DELETE to confirm permanent account deletion');
  }

  const user = await User.findById(req.user._id).select("+password");
  if (!user) throw new ApiError(404, "User not found");

  // Repeated deletion requests: treat an already-anonymized/deleted account as a no-op
  // while ensuring no authorized access remains.
  if (user.isDeleted) {
    await deleteUserSessions(user._id);
    return res
      .status(200)
      .clearCookie("accessToken", accessCookieOptions)
      .clearCookie("refreshToken", refreshCookieOptions)
      .json(new ApiResponse(200, {}, "Account already deleted"));
  }

  if (!(await user.isPasswordCorrect(password))) {
    throw new ApiError(400, "Invalid password");
  }

  // Prevent accidental lockout/deletion of the last active admin.
  if (user.role === "admin" && user.isActivated) {
    const activeAdmins = await User.countDocuments({ role: "admin", isActivated: true, isDeleted: { $ne: true } });
    if (activeAdmins <= 1) throw new ApiError(409, "Cannot delete the last active admin");
  }

  const avatarPublicId = user.avatarPublicId;
  const emailForNotice = user.email;
  const nameForNotice = user.name;
  const userId = user._id;

  // 1) Revoke active sessions/refresh tokens (ensures no further authorized access).
  await deleteUserSessions(userId);

  // 2) Delete eligible personal data (notifications). Keep audit/business/financial records.
  await Notification.deleteMany({ user: userId }).catch((error) =>
    logger.warn("Account deletion: notification cleanup failed", { error, requestId: req.id, userId: String(userId) }),
  );

  // 3) Anonymize + disable the user (never delete orders/payments/audit/transaction records).
  const tombstone = `deleted+${userId.toString()}@deleted.invalid`;
  user.name = "Deleted User";
  user.email = tombstone;
  user.password = crypto.randomBytes(32).toString("base64url");
  user.avatar = "";
  user.avatarPublicId = "";
  user.bio = "";
  user.phone = "";
  user.profession = "";
  user.address = "";
  user.socials = { linkedin: "", github: "", twitter: "", website: "" };
  user.provider = "";
  user.providerId = "";
  user.permissions = [];
  user.role = "user";
  user.isActivated = false;
  user.isEmailVerified = false;
  user.pendingEmail = "";
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpire = undefined;
  user.emailChangeToken = undefined;
  user.emailChangeExpire = undefined;
  user.deactivatedAt = null;
  user.deletedAt = new Date();
  user.isDeleted = true;
  await user.save();

  // 4) Best-effort external cleanup and notification.
  if (avatarPublicId) await deleteFromCloudinary(avatarPublicId).catch(() => {});
  EmailService.sendAccountDeletedEmail({ email: emailForNotice, name: nameForNotice }).catch((error) =>
    logger.warn("Account deleted email failed", { error, requestId: req.id, userId: String(userId) }),
  );
  recordAudit({
    req,
    userId,
    action: "account.self_deleted",
    resource: "user",
    resourceId: String(userId),
  }).catch(() => {});

  return res
    .status(200)
    .clearCookie("accessToken", accessCookieOptions)
    .clearCookie("refreshToken", refreshCookieOptions)
    .json(new ApiResponse(200, {}, "Account deleted successfully"));
});

export {
  getMyProfile,
  updateProfile,
  updateSocialLinks,
  updateAvatar,
  removeAvatar,
  deleteAccount,
};
