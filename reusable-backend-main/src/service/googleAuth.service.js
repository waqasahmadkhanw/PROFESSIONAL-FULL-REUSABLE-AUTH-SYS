import { OAuth2Client } from "google-auth-library";
import crypto from "crypto";
import { ApiError } from "../utils/ApiError.js";

const GOOGLE_ISSUERS = new Set(["accounts.google.com", "https://accounts.google.com"]);

let cachedClient = null;
let cachedAudienceKey = "";

const getAllowedAudiences = () => {
  const raw = process.env.GOOGLE_CLIENT_IDS || process.env.GOOGLE_CLIENT_ID || "";
  const ids = String(raw)
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  return [...new Set(ids)];
};

const getClient = (audiences) => {
  const key = audiences.join("|");
  if (cachedClient && cachedAudienceKey === key) return cachedClient;
  // Client verifies signature/certificates, expiration, and audience (when provided).
  cachedClient = new OAuth2Client();
  cachedAudienceKey = key;
  return cachedClient;
};

export const verifyGoogleCredential = async (credential) => {
  const idToken = typeof credential === "string" ? credential.trim() : "";
  if (!idToken) throw new ApiError(400, "Google credential is required");

  const audiences = getAllowedAudiences();
  if (!audiences.length) {
    throw new ApiError(500, "Google authentication is not configured");
  }

  let ticket;
  try {
    const client = getClient(audiences);
    ticket = await client.verifyIdToken({ idToken, audience: audiences });
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(401, "Invalid Google credential");
  }

  const payload = ticket?.getPayload?.();
  if (!payload) throw new ApiError(401, "Invalid Google credential");

  if (!GOOGLE_ISSUERS.has(String(payload.iss || ""))) {
    throw new ApiError(401, "Invalid Google credential");
  }
  // Audience is enforced by verifyIdToken; keep an explicit guard for defense-in-depth.
  if (!audiences.includes(String(payload.aud || ""))) {
    throw new ApiError(401, "Invalid Google credential");
  }

  const email = String(payload.email || "").trim().toLowerCase();
  if (!email) throw new ApiError(400, "Google account email is required");
  if (payload.email_verified !== true) {
    throw new ApiError(403, "Google account email is not verified");
  }

  const sub = String(payload.sub || "").trim();
  if (!sub) throw new ApiError(401, "Invalid Google credential");

  return {
    provider: "google",
    providerId: sub,
    email,
    name: String(payload.name || "").trim(),
    picture: String(payload.picture || "").trim(),
  };
};

export const generateRandomPassword = () => crypto.randomBytes(32).toString("base64url");
