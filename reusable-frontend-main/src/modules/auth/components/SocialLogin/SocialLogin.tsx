"use client";

import { Loader2 } from "lucide-react";
import type { ReactNode } from "react";

export type SocialProvider =
  | "google"
  | "github"
  | "facebook"
  | "apple"
  | "linkedin";

interface SocialProviderItem {
  id: SocialProvider;
  label: string;
  icon?: ReactNode;
}

interface SocialLoginProps {
  providers?: SocialProviderItem[];
  disabled?: boolean;
  loading?: boolean;
  loadingProvider?: SocialProvider | null;
  onProviderClick: (provider: SocialProvider) => void;
  googleSlot?: ReactNode;
}

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
    <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.2-.9 2.2-1.9 2.9l3.1 2.4c1.8-1.7 2.8-4.1 2.8-7 0-.7-.1-1.5-.2-2.2H12z" />
    <path fill="#34A853" d="M12 22c2.6 0 4.8-.9 6.4-2.6l-3.1-2.4c-.9.6-2 1-3.3 1-2.5 0-4.7-1.7-5.4-4H3.4v2.5C5 19.8 8.2 22 12 22z" />
    <path fill="#4A90E2" d="M6.6 14c-.2-.6-.3-1.3-.3-2s.1-1.4.3-2V7.5H3.4C2.5 9.2 2 11.1 2 12s.5 2.8 1.4 4.5L6.6 14z" />
    <path fill="#FBBC05" d="M12 6c1.4 0 2.7.5 3.7 1.4l2.8-2.8C16.8 3 14.6 2 12 2 8.2 2 5 4.2 3.4 7.5L6.6 10c.7-2.3 2.9-4 5.4-4z" />
  </svg>
);

const DEFAULT_PROVIDERS: SocialProviderItem[] = [
  {
    id: "google",
    label: "Continue with Google",
    icon: <GoogleIcon />,
  },
];

export default function SocialLogin({
  providers = DEFAULT_PROVIDERS,
  disabled = false,
  loading = false,
  loadingProvider = null,
  onProviderClick,
  googleSlot,
}: SocialLoginProps) {
  return (
    <div className="space-y-3">
      {providers.map((provider) => {
        if (provider.id === "google" && googleSlot) {
          return (
            <div key={provider.id} className={disabled || loading ? "pointer-events-none opacity-60" : ""} aria-busy={loading && loadingProvider === "google"}>
              {googleSlot}
            </div>
          );
        }
        const isLoading = loading && (!loadingProvider || loadingProvider === provider.id);
        return (
          <button
            key={provider.id}
            type="button"
            disabled={disabled || loading}
            aria-busy={isLoading}
            onClick={() => onProviderClick(provider.id)}
            className="flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-sm font-medium text-slate-200 transition-all duration-200 hover:border-slate-700 hover:bg-slate-800/80 hover:text-white hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" /> : provider.icon}
            <span>{isLoading ? "Signing in..." : provider.label}</span>
          </button>
        );
      })}
    </div>
  );
}