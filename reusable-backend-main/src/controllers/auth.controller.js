import crypto from "crypto";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import EmailService from "../service/email.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { resolvePermissions } from "../middlewares/auth.middleware.js";
import { issueSessionTokens } from "../service/auth.service.js";
import { verifyGoogleCredential, generateRandomPassword } from "../service/googleAuth.service.js";
import {
  findActiveSession,
  revokeAllUserSessions,
  revokeSession,
  rotateSession,
} from "../service/session.service.js";
import {
  getJwtExpirationDate,
  hashToken,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../utils/token.js";
import { accessCookieOptions, refreshCookieOptions } from "../utils/Options.js";
import {
  notifyLoginIfNeeded,
  getLoginLockoutState,
  recordFailedLoginAttempt,
  clearLoginAttempts,
  LOGIN_SECURITY,
} from "../service/security.service.js";
import { logger } from "../utils/logger.js";

const publicUser = (query) =>
  query.select(
    "-password -resetPasswordToken -resetPasswordExpire -emailVerificationToken -emailVerificationExpire -emailChangeToken -emailChangeExpire",
  );

const buildVerificationLink = (token) => {
  const base = (
    process.env.VERIFY_EMAIL_URL ||
    `${process.env.WEB_URL || "http://localhost:3000"}/verify-email`
  ).trim();
  return base.includes("{token}")
    ? base.replace("{token}", encodeURIComponent(token))
    : `${base}${base.includes("?") ? "&" : "?"}token=${encodeURIComponent(token)}`;
};

const buildEmailChangeVerificationLink = (token) => {
  const base = (
    process.env.VERIFY_EMAIL_CHANGE_URL ||
    `${process.env.WEB_URL || "http://localhost:3000"}/verify-email-change`
  ).trim();
  return base.includes("{token}")
    ? base.replace("{token}", encodeURIComponent(token))
    : `${base}${base.includes("?") ? "&" : "?"}token=${encodeURIComponent(token)}`;
};

const registerUser = asyncHandler(async (req, res) => {
  // 1. Get user details from req.body and uploaded files
  // 2. Validate required fields and uploaded files
  // 3. Check whether the user already exists
  // 4. Upload media and create the user in the database
  // 5. Remove sensitive fields and return the response

  const { name, email, password } = req.body;
  const normalizedEmail = email?.trim().toLowerCase();
  if (!name?.trim() || !normalizedEmail || !password) {
    throw new ApiError(400, "Name, email and password are required");
  }
  if (password.length < 8) throw new ApiError(400, "Password must be at least 8 characters");
  if (await User.exists({ email: normalizedEmail })) {
    throw new ApiError(409, "Email is already registered");
  }

  let user;
  try {
    user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
      role: "user",
      avatar: "",
    });
  } catch (error) {
    // A concurrent registration may pass the exists() check above and hit the
    // unique index here. Surface it as a conflict, not a 500.
    if (error?.code === 11000) throw new ApiError(409, "Email is already registered");
    throw error;
  }

  if (req.file?.path) {
    try {
      const uploaded = await uploadOnCloudinary(req.file.path);
      if (uploaded) {
        user.avatar = uploaded.secure_url || uploaded.url || "";
        user.avatarPublicId = uploaded.public_id || "";
        await user.save();
      }
    } catch (error) {
      logger.warn("Registration avatar upload failed", { error, requestId: req.id });
    }
  }

  const createdUser = await publicUser(User.findById(user._id));
  const verificationToken = user.generateEmailVerificationToken();
  await user.save();
  const verificationLink = buildVerificationLink(verificationToken);
  EmailService.sendVerificationEmail(createdUser, verificationLink, 10).catch((error) =>
    logger.warn("Verification email failed", { error, requestId: req.id }),
  );
  EmailService.sendWelcomeEmail(createdUser).catch((error) =>
    logger.warn("Welcome email failed", { error, requestId: req.id }),
  );

  return res.status(201).json(new ApiResponse(201, createdUser, "User registered successfully"));
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  // 1. Get required data from req.body, req.params, or req.query
  // 2. Validate the request data and authorization
  // 3. Perform the required database operation
  // 4. Check the operation result and handle missing data
  // 5. Return the successful API response

  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) throw new ApiError(400, "Old and new passwords are required");
  if (newPassword.length < 8) throw new ApiError(400, "New password must be at least 8 characters");

  const user = await User.findById(req.user._id).select("+password");
  if (!user || !(await user.isPasswordCorrect(oldPassword))) {
    throw new ApiError(400, "Current password is incorrect");
  }

  user.password = newPassword;
  await user.save();
  await revokeAllUserSessions(user._id);

  // Confirmation notification (best-effort; never include password). Single send per successful change.
  EmailService.sendPasswordChangeEmail({ email: user.email, name: user.name }, { changedAt: new Date().toISOString() }).catch(
    (error) => logger.warn("Password change confirmation email failed", { error, requestId: req.id, userId: String(user._id) }),
  );

  return res
    .status(200)
    .clearCookie("accessToken", accessCookieOptions)
    .clearCookie("refreshToken", refreshCookieOptions)
    .json(new ApiResponse(200, {}, "Password changed successfully. Please sign in again."));
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
  const generic = "If the account exists, a reset link has been sent";
  if (!user) return res.status(200).json(new ApiResponse(200, {}, generic));

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

  return res.status(200).json(new ApiResponse(200, {}, generic));
});

const resetPassword = asyncHandler(async (req, res) => {
  // 1. Get required data from req.body, req.params, or req.query
  // 2. Validate the request data and authorization
  // 3. Perform the required database operation
  // 4. Check the operation result and handle missing data
  // 5. Return the successful API response

  const { token } = req.params;
  const { password } = req.body;
  if (!token || !password || password.length < 8) {
    throw new ApiError(400, "Valid token and password are required");
  }

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

  return res
    .status(200)
    .clearCookie("accessToken", accessCookieOptions)
    .clearCookie("refreshToken", refreshCookieOptions)
    .json(new ApiResponse(200, {}, "Password reset successful"));
});

const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.body;
  if (!token) throw new ApiError(400, "Verification token is required");

  const hashedToken = hashToken(token);
  const now = new Date();

  // Atomic consume: matches token, not expired, not yet verified â€” prevents reuse and
  // concurrent double-verification. Previous/other tokens cannot match this hash.
  const user = await User.findOneAndUpdate(
    {
      emailVerificationToken: hashedToken,
      emailVerificationExpire: { $gt: now },
      isEmailVerified: { $ne: true },
    },
    {
      $set: { isEmailVerified: true },
      $unset: { emailVerificationToken: 1, emailVerificationExpire: 1 },
    },
    { new: true },
  );

  if (!user) {
    // Distinguish "already verified" (no active matching token) is intentionally avoided
    // to prevent token probing; treat as invalid/expired.
    throw new ApiError(400, "Invalid or expired verification token");
  }

  return res.status(200).json(new ApiResponse(200, {}, "Email verified successfully"));
});

const resendVerificationEmail = asyncHandler(async (req, res) => {
  const normalizedEmail = req.body.email?.trim().toLowerCase();
  if (!normalizedEmail) throw new ApiError(400, "Email is required");

  // Generic response to avoid account enumeration.
  const generic = "If an unverified account exists for that email, a verification link has been sent";

  const user = await User.findOne({ email: normalizedEmail }).select(
    "+emailVerificationToken +emailVerificationExpire +isEmailVerified",
  );
  if (!user || user.isEmailVerified) {
    return res.status(200).json(new ApiResponse(200, {}, generic));
  }

  // Generate a fresh token and atomically replace any previous token. Only one active
  // token exists after this update (the newly issued hash). Concurrent requests: the last
  // successful atomic write wins; emails for superseded tokens become invalid.
  const token = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  const updated = await User.findOneAndUpdate(
    { _id: user._id, isEmailVerified: { $ne: true } },
    {
      $set: { emailVerificationToken: hashedToken, emailVerificationExpire: expiresAt },
    },
    { new: true },
  );

  if (!updated) {
    // User became verified between read and update.
    return res.status(200).json(new ApiResponse(200, {}, generic));
  }

  try {
    const verificationLink = buildVerificationLink(token);
    await EmailService.sendVerificationEmail(updated, verificationLink, 10);
  } catch (error) {
    logger.warn("Resend verification email failed", { error, requestId: req.id });
    // Invalidate the token we just issued so a failed send does not leave an unusable
    // active token that blocks clear retry semantics; user can request again.
    await User.updateOne(
      { _id: updated._id, emailVerificationToken: hashedToken, isEmailVerified: { $ne: true } },
      { $unset: { emailVerificationToken: 1, emailVerificationExpire: 1 } },
    );
    throw new ApiError(500, "Unable to send verification email");
  }

  return res.status(200).json(new ApiResponse(200, {}, generic));
});

const loginUser = asyncHandler(async (req, res) => {
  // 1. Get login credentials from req.body
  // 2. Validate username/email and password
  // 3. Find the user and verify the password
  // 4. Check account activation status
  // 5. Generate access and refresh tokens
  // 6. Set cookies and return the authenticated user

  const normalizedEmail = req.body.email?.trim().toLowerCase();
  const { password } = req.body;
  if (!normalizedEmail || !password) throw new ApiError(400, "Email and password are required");

  const lockout = await getLoginLockoutState({ email: normalizedEmail, ip: req.ip });
  if (lockout.locked) {
    const retryAfterSec = Math.max(1, Math.ceil((lockout.remainingMs || LOGIN_SECURITY.lockoutMs) / 1000));
    res.set("Retry-After", String(retryAfterSec));
    throw new ApiError(429, "Too many failed login attempts. Please try again later.");
  }

  const user = await User.findOne({ email: normalizedEmail }).select("+password");
  if (!user || !(await user.isPasswordCorrect(password))) {
    await recordFailedLoginAttempt({ email: normalizedEmail, ip: req.ip, req });
    throw new ApiError(401, "Invalid credentials");
  }

  if (user.isDeleted) {
    throw new ApiError(401, "Invalid credentials");
  }

  if (!user.isActivated) {
    throw new ApiError(403, "Account is not activated. Please verify your email before signing in.");
  }

  if (!user.isEmailVerified) {
    throw new ApiError(403, "Email verification required. Please verify your email before signing in.");
  }

  await clearLoginAttempts({ email: normalizedEmail, ip: req.ip });

  const { accessToken, refreshToken, session } = await issueSessionTokens({
    userId: user._id,
    userAgent: req.get("user-agent"),
    ipAddress: req.ip,
  });

  await notifyLoginIfNeeded({
    user,
    session,
    ipAddress: req.ip,
    userAgent: req.get("user-agent"),
    requestId: req.id,
  });

  const loggedInUserDoc = await publicUser(User.findById(user._id));
  const loggedInUser = loggedInUserDoc?.toObject?.() ?? loggedInUserDoc;
  loggedInUser.permissions = await resolvePermissions(user);

  return res
    .status(200)
    .cookie("accessToken", accessToken, accessCookieOptions)
    .cookie("refreshToken", refreshToken, refreshCookieOptions)
    .json(new ApiResponse(200, { user: loggedInUser }, "Login successful"));
});

const googleLogin = asyncHandler(async (req, res) => {
  // 1. Verify Google ID token server-side (signature, issuer, audience, expiry)
  // 2. Find existing account by verified email (or provider identity)
  // 3. Create/link account without duplicates
  // 4. Enforce activation, establish existing session/JWT+refresh infrastructure

  const googleUser = await verifyGoogleCredential(req.body?.credential);
  const normalizedEmail = googleUser.email;

  let user = await User.findOne({ email: normalizedEmail });

  if (!user) {
    user = await User.findOne({ provider: "google", providerId: googleUser.providerId });
  }

  if (!user) {
    try {
      user = await User.create({
        name: googleUser.name || normalizedEmail.split("@")[0] || "User",
        email: normalizedEmail,
        password: generateRandomPassword(),
        role: "user",
        avatar: googleUser.picture || "",
        provider: "google",
        providerId: googleUser.providerId,
        isActivated: true,
        isEmailVerified: true,
      });
    } catch (error) {
      if (error?.code === 11000) {
        user = await User.findOne({ email: normalizedEmail });
        if (!user) user = await User.findOne({ provider: "google", providerId: googleUser.providerId });
        if (!user) throw new ApiError(409, "Unable to complete Google sign-in");
      } else {
        throw error;
      }
    }
  }

  if (!user) throw new ApiError(401, "Google authentication failed");
  if (user.isDeleted) throw new ApiError(401, "Google authentication failed");

  let dirty = false;
  if (user.provider !== "google" || user.providerId !== googleUser.providerId) {
    user.provider = "google";
    user.providerId = googleUser.providerId;
    dirty = true;
  }
  if (!user.isEmailVerified) {
    user.isEmailVerified = true;
    dirty = true;
  }
  if (!user.avatar && googleUser.picture) {
    user.avatar = googleUser.picture;
    dirty = true;
  }
  if (dirty) await user.save();

  if (!user.isActivated) {
    throw new ApiError(403, "Account is not activated. Please contact support.");
  }
  if (!user.isEmailVerified) {
    throw new ApiError(403, "Email verification required. Please verify your email before signing in.");
  }

  const { accessToken, refreshToken, session } = await issueSessionTokens({
    userId: user._id,
    userAgent: req.get("user-agent"),
    ipAddress: req.ip,
  });

  await notifyLoginIfNeeded({
    user,
    session,
    ipAddress: req.ip,
    userAgent: req.get("user-agent"),
    requestId: req.id,
  });

  const loggedInUserDoc = await publicUser(User.findById(user._id));
  const loggedInUser = loggedInUserDoc?.toObject?.() ?? loggedInUserDoc;
  loggedInUser.permissions = await resolvePermissions(user);

  return res
    .status(200)
    .cookie("accessToken", accessToken, accessCookieOptions)
    .cookie("refreshToken", refreshToken, refreshCookieOptions)
    .json(new ApiResponse(200, { user: loggedInUser }, "Google login successful"));
});

const logoutUser = asyncHandler(async (req, res) => {
  // 1. Get the authenticated user from req.user
  // 2. Validate the authenticated request
  // 3. Remove the stored refresh token
  // 4. Clear authentication cookies
  // 5. Return the logout response

  const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

  if (incomingRefreshToken) {
    try {
      const decoded = verifyRefreshToken(incomingRefreshToken);
      const session = await findActiveSession(decoded.sessionId, decoded._id);
      if (session) {
        const matches = session.tokenHash === hashToken(incomingRefreshToken);
        if (matches) await revokeSession(decoded.sessionId, decoded._id);
      }
    } catch {
      // Logout is intentionally idempotent. Invalid/expired refresh tokens
      // should still result in both authentication cookies being cleared.
    }
  }

  return res
    .status(200)
    .clearCookie("refreshToken", refreshCookieOptions)
    .clearCookie("accessToken", accessCookieOptions)
    .json(new ApiResponse(200, {}, "Logout successful"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  // 1. Get the incoming refresh token from cookies or req.body
  // 2. Validate and verify the refresh token
  // 3. Find the user and compare the stored refresh token
  // 4. Generate new access and refresh tokens
  // 5. Set cookies and return the refreshed tokens

  const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
  if (!incomingRefreshToken) throw new ApiError(401, "Refresh token is required");

  const decoded = verifyRefreshToken(incomingRefreshToken);
  const session = await findActiveSession(decoded.sessionId, decoded._id);
  if (!session) throw new ApiError(401, "Session is invalid or expired");

  const tokenHash = hashToken(incomingRefreshToken);
  if (session.tokenHash !== tokenHash) {
    await revokeSession(decoded.sessionId, decoded._id);
    throw new ApiError(401, "Refresh token reuse detected");
  }

  const user = await User.findById(decoded._id);
  if (!user || user.isDeleted || !user.isActivated || !user.isEmailVerified) {
    await revokeSession(decoded.sessionId, decoded._id);
    throw new ApiError(401, "Session is invalid");
  }

  const refreshToken = signRefreshToken({ userId: user._id, sessionId: session._id });
  const accessToken = signAccessToken({
    userId: user._id,
    email: user.email,
    role: user.role,
    sessionId: session._id,
  });

  const rotated = await rotateSession({
    sessionId: session._id,
    userId: user._id,
    currentRefreshToken: incomingRefreshToken,
    nextRefreshToken: refreshToken,
    expiresAt: getJwtExpirationDate(refreshToken),
  });

  if (!rotated) {
    await revokeSession(session._id, user._id);
    throw new ApiError(401, "Refresh token reuse detected");
  }

  return res
    .status(200)
    .cookie("accessToken", accessToken, accessCookieOptions)
    .cookie("refreshToken", refreshToken, refreshCookieOptions)
    .json(new ApiResponse(200, {}, "Access token refreshed"));
});

const linkGoogle = asyncHandler(async (req, res) => {
  const googleUser = await verifyGoogleCredential(req.body?.credential);
  const userId = req.user?._id;
  if (!userId) throw new ApiError(401, "Authentication required");

  const user = await User.findById(userId).select("+emailVerificationToken +emailVerificationExpire");
  if (!user) throw new ApiError(404, "User not found");

  const normalizedUserEmail = String(user.email || "").trim().toLowerCase();
  if (normalizedUserEmail !== googleUser.email) {
    throw new ApiError(400, "Google account email must match your account email");
  }

  const existingLinked = await User.findOne({
    provider: "google",
    providerId: googleUser.providerId,
    _id: { $ne: user._id },
  }).select("_id");
  if (existingLinked) {
    throw new ApiError(409, "This Google account is already linked to another user");
  }

  user.provider = "google";
  user.providerId = googleUser.providerId;
  // Google identity is server-verified (including verified email); mark verified to prevent takeover via unverified matching.
  user.isEmailVerified = true;
  if (!user.avatar && googleUser.picture) user.avatar = googleUser.picture;
  await user.save();

  return res.status(200).json(new ApiResponse(200, {}, "Google account linked successfully"));
});

const unlinkGoogle = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  if (!userId) throw new ApiError(401, "Authentication required");

  const { password } = req.body ?? {};
  if (!password || typeof password !== "string") {
    throw new ApiError(400, "Password is required to unlink Google");
  }

  const user = await User.findById(userId).select("+password");
  if (!user) throw new ApiError(404, "User not found");

  if (user.provider !== "google" || !user.providerId) {
    throw new ApiError(400, "No Google account is linked");
  }

  // Require a valid alternate login method (verified email/password credentials).
  if (!(await user.isPasswordCorrect(password))) {
    throw new ApiError(400, "Invalid password");
  }

  user.provider = "";
  user.providerId = "";
  await user.save();

  return res.status(200).json(new ApiResponse(200, {}, "Google account unlinked successfully"));
});

const changeEmail = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  if (!userId) throw new ApiError(401, "Authentication required");

  const { newEmail, password } = req.body ?? {};
  const normalizedNewEmail = String(newEmail || "").trim().toLowerCase();
  if (!normalizedNewEmail) throw new ApiError(400, "New email is required");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedNewEmail) || normalizedNewEmail.length > 254) {
    throw new ApiError(400, "A valid new email is required");
  }
  if (!password || typeof password !== "string") {
    throw new ApiError(400, "Password is required to change email");
  }

  const user = await User.findById(userId).select(
    "+password +emailChangeToken +emailChangeExpire +isEmailVerified",
  );
  if (!user) throw new ApiError(404, "User not found");

  if (!(await user.isPasswordCorrect(password))) {
    throw new ApiError(400, "Invalid password");
  }

  const currentEmail = String(user.email || "").trim().toLowerCase();
  if (normalizedNewEmail === currentEmail) {
    throw new ApiError(400, "New email must be different from your current email");
  }

  const existing = await User.findOne({ email: normalizedNewEmail, _id: { $ne: user._id } })
    .select("_id")
    .lean();
  if (existing) {
    throw new ApiError(409, "Email is already in use");
  }

  // Generate secure token and store pending email separately; replaces any previous pending token.
  const token = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  const updated = await User.findOneAndUpdate(
    { _id: user._id },
    {
      $set: { pendingEmail: normalizedNewEmail, emailChangeToken: hashedToken, emailChangeExpire: expiresAt },
    },
    { new: true },
  );
  if (!updated) throw new ApiError(404, "User not found");

  const verifyLink = buildEmailChangeVerificationLink(token);
  try {
    await EmailService.sendChangeEmailEmail({
      to: normalizedNewEmail,
      name: updated.name,
      verifyLink,
      expiresInMinutes: 10,
      currentEmail,
    });
  } catch (error) {
    logger.warn("Email change verification send failed", { error, requestId: req.id, userId: String(user._id) });
    await User.updateOne(
      { _id: updated._id, emailChangeToken: hashedToken, pendingEmail: normalizedNewEmail },
      { $unset: { pendingEmail: 1, emailChangeToken: 1, emailChangeExpire: 1 } },
    );
    throw new ApiError(500, "Unable to send verification email");
  }

  return res.status(200).json(
    new ApiResponse(200, { pendingEmail: normalizedNewEmail }, "Verification email sent to the new address"),
  );
});

const verifyEmailChange = asyncHandler(async (req, res) => {
  const token = req.body?.token || req.params?.token;
  if (!token || typeof token !== "string") throw new ApiError(400, "Verification token is required");

  const hashedToken = hashToken(token.trim());
  const now = new Date();

  // Find candidate first to validate pending state, then consume atomically.
  const candidate = await User.findOne({
    emailChangeToken: hashedToken,
    emailChangeExpire: { $gt: now },
  }).select("+emailChangeToken +emailChangeExpire +pendingEmail +email");

  if (!candidate) {
    throw new ApiError(400, "Invalid or expired verification token");
  }

  const nextEmail = String(candidate.pendingEmail || "").trim().toLowerCase();
  if (!nextEmail) {
    throw new ApiError(400, "Invalid or expired verification token");
  }

  // Ensure the pending email is still free (handle duplicate/race).
  const conflict = await User.findOne({ email: nextEmail, _id: { $ne: candidate._id } })
    .select("_id")
    .lean();
  if (conflict) {
    await User.updateOne(
      { _id: candidate._id, emailChangeToken: hashedToken },
      { $unset: { pendingEmail: 1, emailChangeToken: 1, emailChangeExpire: 1 } },
    );
    throw new ApiError(409, "Email is already in use");
  }

  const oldEmail = String(candidate.email || "").trim().toLowerCase();
  const updated = await User.findOneAndUpdate(
    {
      _id: candidate._id,
      emailChangeToken: hashedToken,
      emailChangeExpire: { $gt: now },
      pendingEmail: nextEmail,
    },
    {
      $set: { email: nextEmail, isEmailVerified: true },
      $unset: { pendingEmail: 1, emailChangeToken: 1, emailChangeExpire: 1 },
    },
    { new: true },
  );

  if (!updated) {
    throw new ApiError(400, "Invalid or expired verification token");
  }

  // Notify previous and new addresses (best-effort; no tokens).
  EmailService.sendEmailChangeNotification({ to: oldEmail, name: updated.name, newEmail: nextEmail }).catch((error) =>
    logger.warn("Email change notification (old) failed", { error, requestId: req.id, userId: String(updated._id) }),
  );
  EmailService.sendEmailChangeNotification({ to: nextEmail, name: updated.name, newEmail: nextEmail }).catch((error) =>
    logger.warn("Email change notification (new) failed", { error, requestId: req.id, userId: String(updated._id) }),
  );

  return res.status(200).json(new ApiResponse(200, { email: nextEmail }, "Email address updated successfully"));
});

const deactivateAccount = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  if (!userId) throw new ApiError(401, "Authentication required");

  const { password } = req.body ?? {};
  if (!password || typeof password !== "string") {
    throw new ApiError(400, "Password is required to deactivate your account");
  }

  // Re-fetch with password for identity confirmation (req.user has password excluded).
  const user = await User.findById(userId).select("+password");
  if (!user) throw new ApiError(404, "User not found");
  if (user.isDeleted) throw new ApiError(404, "User not found");

  if (!user.isActivated) {
    throw new ApiError(409, "Account is already deactivated");
  }

  if (!(await user.isPasswordCorrect(password))) {
    throw new ApiError(400, "Invalid password");
  }

  user.isActivated = false;
  user.deactivatedAt = new Date();
  await user.save();

  // Revoke existing refresh tokens/sessions and clear auth cookies for this client.
  await revokeAllUserSessions(user._id);

  EmailService.sendAccountDeactivatedEmail({ email: user.email, name: user.name }).catch((error) =>
    logger.warn("Account deactivated email failed", { error, requestId: req.id, userId: String(user._id) }),
  );

  return res
    .status(200)
    .clearCookie("accessToken", accessCookieOptions)
    .clearCookie("refreshToken", refreshCookieOptions)
    .json(new ApiResponse(200, {}, "Account deactivated successfully"));
});

const RESTORE_ACCOUNT_DAYS = Math.max(1, Number(process.env.ACCOUNT_RESTORE_DAYS || 30));

const restoreAccount = asyncHandler(async (req, res) => {
  const normalizedEmail = String(req.body?.email || "").trim().toLowerCase();
  const { password } = req.body ?? {};
  if (!normalizedEmail || !password || typeof password !== "string") {
    throw new ApiError(400, "Email and password are required");
  }

  // Ownership verification + eligibility: only the account owner with valid credentials.
  const user = await User.findOne({ email: normalizedEmail }).select("+password");
  if (!user || !(await user.isPasswordCorrect(password))) {
    // Avoid confirming account state on bad credentials.
    throw new ApiError(401, "Invalid credentials");
  }

  if (user.isActivated) {
    throw new ApiError(409, "Account is already active");
  }

  // Restoration eligibility/expiry (coordinated with deactivation). If deactivatedAt is missing
  // (legacy/admin-deactivated), allow restoration for the verified owner.
  if (user.deactivatedAt) {
    const deadline = new Date(user.deactivatedAt).getTime() + RESTORE_ACCOUNT_DAYS * 24 * 60 * 60 * 1000;
    if (Date.now() > deadline) {
      throw new ApiError(410, "Restoration period has expired. Please contact support.");
    }
  }

  // Restore safely; preserve all existing account information.
  user.isActivated = true;
  user.deactivatedAt = null;
  await user.save();

  // Ensure no stale sessions remain; re-establish authentication securely via a fresh session.
  await revokeAllUserSessions(user._id);

  const { accessToken, refreshToken, session } = await issueSessionTokens({
    userId: user._id,
    userAgent: req.get("user-agent"),
    ipAddress: req.ip,
  });

  await notifyLoginIfNeeded({
    user,
    session,
    ipAddress: req.ip,
    userAgent: req.get("user-agent"),
    requestId: req.id,
  });

  const restoredUserDoc = await publicUser(User.findById(user._id));
  const restoredUser = restoredUserDoc?.toObject?.() ?? restoredUserDoc;
  restoredUser.permissions = await resolvePermissions(user);

  EmailService.sendAccountRestoredEmail({ email: user.email, name: user.name }).catch((error) =>
    logger.warn("Account restored email failed", { error, requestId: req.id, userId: String(user._id) }),
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, accessCookieOptions)
    .cookie("refreshToken", refreshToken, refreshCookieOptions)
    .json(new ApiResponse(200, { user: restoredUser }, "Account restored successfully"));
});

export {
  registerUser,
  changeCurrentPassword,
  changeEmail,
  verifyEmailChange,
  deactivateAccount,
  restoreAccount,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerificationEmail,
  loginUser,
  googleLogin,
  linkGoogle,
  unlinkGoogle,
  logoutUser,
  refreshAccessToken,
};
