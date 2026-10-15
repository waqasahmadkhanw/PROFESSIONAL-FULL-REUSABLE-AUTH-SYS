import mongoose, { Schema } from "mongoose";

const rateLimitSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, index: true },
    hits: { type: Number, required: true, min: 0 },
    resetAt: { type: Date, required: true },
  },
  { versionKey: false, timestamps: true },
);

rateLimitSchema.index({ resetAt: 1 }, { expireAfterSeconds: 0 });

export const RateLimit = mongoose.model("RateLimit", rateLimitSchema);
