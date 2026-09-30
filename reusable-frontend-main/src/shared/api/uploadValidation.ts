import { env } from "@/shared/config/env";

export type UploadProfile = "image" | "document" | "audio" | "video" | "all";

export const UPLOAD_MIME_TYPES = Object.freeze({
  image: ["image/jpeg", "image/png", "image/gif", "image/webp"],
  document: ["application/pdf"],
  audio: ["audio/mpeg", "audio/wav"],
  video: ["video/mp4", "video/quicktime"],
  all: [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "application/pdf",
    "audio/mpeg",
    "audio/wav",
    "video/mp4",
    "video/quicktime",
  ],
} as const);

const startsWithBytes = (bytes: Uint8Array, expected: number[]) =>
  expected.every((value, index) => bytes[index] === value);

/**
 * Mirrors the backend magic-byte checks before a request leaves the browser.
 * Server-side validation remains authoritative; this is an early UX/security
 * guard and never replaces the backend checks.
 */
async function detectMime(file: File): Promise<string | null> {
  const bytes = new Uint8Array(await file.slice(0, 4100).arrayBuffer());

  if (bytes.length >= 3 && startsWithBytes(bytes, [0xff, 0xd8, 0xff])) return "image/jpeg";
  if (startsWithBytes(bytes, [137, 80, 78, 71, 13, 10, 26, 10])) return "image/png";
  if (bytes.length >= 6 && new TextDecoder().decode(bytes.slice(0, 6)).match(/^GIF(?:87a|89a)$/)) return "image/gif";
  if (bytes.length >= 12 && new TextDecoder().decode(bytes.slice(0, 4)) === "RIFF" && new TextDecoder().decode(bytes.slice(8, 12)) === "WEBP") return "image/webp";
  if (bytes.length >= 5 && new TextDecoder().decode(bytes.slice(0, 5)) === "%PDF-") return "application/pdf";
  if (bytes.length >= 3 && new TextDecoder().decode(bytes.slice(0, 3)) === "ID3") return "audio/mpeg";
  if (bytes.length >= 2 && bytes[0] === 0xff && (bytes[1] & 0xe0) === 0xe0) return "audio/mpeg";
  if (bytes.length >= 12 && new TextDecoder().decode(bytes.slice(0, 4)) === "RIFF" && new TextDecoder().decode(bytes.slice(8, 12)) === "WAVE") return "audio/wav";
  if (bytes.length >= 12 && new TextDecoder().decode(bytes.slice(4, 8)) === "ftyp") {
    // The backend accepts both MP4 and MOV through the ISO BMFF `ftyp` signature.
    return file.type === "video/quicktime" ? "video/quicktime" : "video/mp4";
  }

  return null;
}

export async function validateUploadFile(
  file: File,
  profile: UploadProfile = "all",
): Promise<void> {
  if (!file) throw new Error("File is required.");
  if (file.size <= 0) throw new Error("The selected file is empty.");
  if (file.size > env.MAX_UPLOAD_SIZE) {
    throw new Error(`File exceeds the ${Math.round(env.MAX_UPLOAD_SIZE / 1024 / 1024)} MB limit.`);
  }

  const allowed = UPLOAD_MIME_TYPES[profile] as readonly string[];
  const detectedMime = await detectMime(file);
  if (!detectedMime || !allowed.includes(detectedMime)) {
    throw new Error("Unsupported or invalid file content.");
  }

  const declaredMime = file.type.toLowerCase();
  if (declaredMime && declaredMime !== detectedMime) {
    throw new Error("File MIME type does not match its actual content.");
  }
}

export async function validateUploadFiles(
  files: File[],
  profile: UploadProfile = "all",
): Promise<void> {
  await Promise.all(files.map((file) => validateUploadFile(file, profile)));
}
