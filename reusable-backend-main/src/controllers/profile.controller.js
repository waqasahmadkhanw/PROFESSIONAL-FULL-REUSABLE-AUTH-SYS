import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";
import { accessCookieOptions, refreshCookieOptions } from "../utils/Options.js";
import { deleteUserSessions } from "../service/session.service.js";

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
  // 1. Get required data from req.body, req.params, or req.query
  // 2. Validate the request data and authorization
  // 3. Perform the required database operation
  // 4. Check the operation result and handle missing data
  // 5. Return the successful API response

  const user = await User.findById(req.user._id);
  if (!user) throw new ApiError(404, "User not found");
  const avatarPublicId = user.avatarPublicId;
  await deleteUserSessions(user._id);
  await user.deleteOne();
  if (avatarPublicId) await deleteFromCloudinary(avatarPublicId).catch(() => {});
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
