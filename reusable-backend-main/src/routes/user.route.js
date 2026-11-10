import { Router } from "express";
import {
  getCurrentUser,
  updateAccountDetails,
  deleteUserAvatar,
  getActiveSessions,
  revokeSessionById,
  revokeAllExceptCurrent,
} from "../controllers/user.controller.js";
import {
  registerUser,
  loginUser,
  googleLogin,
  linkGoogle,
  unlinkGoogle,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  changeEmail,
  verifyEmailChange,
  deactivateAccount,
  restoreAccount,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerificationEmail,
} from "../controllers/auth.controller.js";
import { authUser, requireVerifiedEmail } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { validateUploadedFileMiddleware } from "../middlewares/fileValidation.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { authRateLimiter, registerRateLimiter } from "../middlewares/rateLimit.middleware.js";
import {
  registerRules,
  loginRules,
  changePasswordRules,
  changeEmailRules,
  verifyEmailChangeRules,
  deactivateAccountRules,
  restoreAccountRules,
  forgotPasswordRules,
  resetPasswordRules,
  googleLoginRules,
  verifyEmailRules,
  resendVerificationRules,
  linkGoogleRules,
  unlinkGoogleRules,
} from "../validators/auth.validator.js";
const router = Router();
router.post(
  "/register",
  registerRateLimiter,
  upload.single("avatar"),
  validateUploadedFileMiddleware({ allowedTypes: "image", required: false }),
  validate(registerRules),
  registerUser,
);
router.post("/login", authRateLimiter, validate(loginRules), loginUser);
router.post("/auth/google", authRateLimiter, validate(googleLoginRules), googleLogin);
router.post("/refresh-token", authRateLimiter, refreshAccessToken);
router.get("/me", authUser, getCurrentUser);
router.patch("/password", authUser, validate(changePasswordRules), changeCurrentPassword);
router.patch("/account", authUser, updateAccountDetails);
router.post("/logout", logoutUser);
router.post("/forgot-password", authRateLimiter, validate(forgotPasswordRules), forgotPassword);
router.post("/reset-password/:token", authRateLimiter, validate(resetPasswordRules), resetPassword);
router.post("/verify-email", authRateLimiter, validate(verifyEmailRules), verifyEmail);
router.post(
  "/change-email",
  authRateLimiter,
  authUser,
  validate(changeEmailRules),
  changeEmail,
);
router.post(
  "/verify-email-change",
  authRateLimiter,
  validate(verifyEmailChangeRules),
  verifyEmailChange,
);
router.post(
  "/verify-email-change/:token",
  authRateLimiter,
  validate(verifyEmailChangeRules),
  verifyEmailChange,
);
router.post(
  "/resend-verification",
  authRateLimiter,
  validate(resendVerificationRules),
  resendVerificationEmail,
);
router.post(
  "/google/link",
  authUser,
  requireVerifiedEmail,
  authRateLimiter,
  validate(linkGoogleRules),
  linkGoogle,
);
router.post(
  "/google/unlink",
  authUser,
  authRateLimiter,
  validate(unlinkGoogleRules),
  unlinkGoogle,
);
router.post(
  "/deactivate",
  authRateLimiter,
  authUser,
  validate(deactivateAccountRules),
  deactivateAccount,
);
router.post(
  "/restore",
  authRateLimiter,
  validate(restoreAccountRules),
  restoreAccount,
);
router.get("/sessions", authUser, getActiveSessions);
router.post("/sessions/revoke-all-except-current", authUser, revokeAllExceptCurrent);
router.post("/sessions/:id/revoke", authUser, revokeSessionById);
router.delete("/avatar", authUser, deleteUserAvatar);
export default router;
