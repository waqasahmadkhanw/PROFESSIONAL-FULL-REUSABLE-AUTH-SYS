/**
 * Authentication request validation rules.
 * Keep these rules at the HTTP boundary; controllers should focus on business logic.
 */
export const registerRules = {
  name: { required: true, type: "string", min: 2, max: 100 },
  email: { required: true, type: "email", max: 254 },
  password: { required: true, type: "string", min: 8, max: 128 },
};

export const loginRules = {
  email: { required: true, type: "email", max: 254 },
  password: { required: true, type: "string", min: 1, max: 128 },
};

export const changePasswordRules = {
  oldPassword: { required: true, type: "string", min: 1, max: 128 },
  newPassword: { required: true, type: "string", min: 8, max: 128 },
};

export const forgotPasswordRules = {
  email: { required: true, type: "email", max: 254 },
};

export const resetPasswordRules = {
  password: { required: true, type: "string", min: 8, max: 128 },
};

export const googleLoginRules = {
  credential: { required: true, type: "string", min: 1 },
};

export const verifyEmailRules = {
  token: { required: true, type: "string", min: 1 },
};

export const resendVerificationRules = {
  email: { required: true, type: "email", max: 254 },
};

export const linkGoogleRules = {
  credential: { required: true, type: "string", min: 1 },
};

export const unlinkGoogleRules = {
  password: { required: true, type: "string", min: 1, max: 128 },
};

export const changeEmailRules = {
  newEmail: { required: true, type: "email", max: 254 },
  password: { required: true, type: "string", min: 1, max: 128 },
};

export const verifyEmailChangeRules = {
  token: { required: true, type: "string", min: 1 },
};

export const deactivateAccountRules = {
  password: { required: true, type: "string", min: 1, max: 128 },
  reason: { type: "string", max: 500 },
};

export const restoreAccountRules = {
  email: { required: true, type: "email", max: 254 },
  password: { required: true, type: "string", min: 1, max: 128 },
};
