export const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD: /^(?=.*[A-Za-z])(?=.*\d).{8,}$/,
  PHONE: /^[0-9]{10,15}$/,
} as const;