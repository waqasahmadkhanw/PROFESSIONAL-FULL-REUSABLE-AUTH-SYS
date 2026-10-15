import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { deleteFromCloudinary } from "../utils/cloudinary.js";
import EmailService from "../service/email.service.js";
import { revokeAllUserSessions } from "../service/session.service.js";

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

const forgotPassword = asyncHandler(async (req, res) => {
  // 1. Get required data from req.body, req.params, or req.query
  // 2. Validate the request data and authorization
  // 3. Perform the required database operation
  // 4. Check the operation result and handle missing data
  // 5. Return the successful API response

  const normalizedEmail = req.body.email?.trim().toLowerCase();
  if (!normalizedEmail) throw new ApiError(400, "Email is required");

  const user = await User.findOne({ email: normalizedEmail });
  if (!user)
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "If the account exists, a reset link has been sent"));

  const token = user.generatePasswordResetToken();
  await user.save();

  const base = (
    process.env.RESET_PASSWORD_URL ||
    `${process.env.WEB_URL || "http://localhost:3000"}/reset-password`
  ).trim();
  const resetLink = base.includes("{token}")
    ? base.replace("{token}", encodeURIComponent(token))
    : `${base}${base.includes("?") ? "&" : "?"}token=${encodeURIComponent(token)}`;

  try {
    await EmailService.sendResetPasswordEmail(user, resetLink);
  } catch {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    throw new ApiError(500, "Unable to send reset email");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "If the account exists, a reset link has been sent"));
});

const resetPassword = asyncHandler(async (req, res) => {
  // 1. Get required data from req.body, req.params, or req.query
  // 2. Validate the request data and authorization
  // 3. Perform the required database operation
  // 4. Check the operation result and handle missing data
  // 5. Return the successful API response

  const { token } = req.params;
  const { password } = req.body;
  if (!token || !password || password.length < 8)
    throw new ApiError(400, "Valid token and password are required");

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  }).select("+password +resetPasswordToken +resetPasswordExpire");

  if (!user) throw new ApiError(400, "Invalid or expired reset token");

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();
  await revokeAllUserSessions(user._id);

  return res.status(200).json(new ApiResponse(200, {}, "Password reset successful"));
});

const deleteUserAvatar = asyncHandler(async (req, res) => {
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

  return res.status(200).json(new ApiResponse(200, {}, "Avatar deleted successfully"));
});

export { getCurrentUser, updateAccountDetails, forgotPassword, resetPassword, deleteUserAvatar };
