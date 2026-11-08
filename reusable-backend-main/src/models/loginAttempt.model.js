import mongoose from "mongoose";

const loginAttemptSchema = new mongoose.Schema(
  {
    identifier: {
      type: String,
      required: true,
      index: true,
      trim: true,
      lowercase: true,
    },
    attempts: {
      type: Number,
      default: 0,
      min: 0,
    },
    lockedAt: {
      type: Date,
      default: null,
    },
    lastAttemptAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

loginAttemptSchema.index({ identifier: 1 }, { unique: true });

export const LoginAttempt = mongoose.model("LoginAttempt", loginAttemptSchema);
