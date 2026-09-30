import Link from "next/link";
import { ReactNode } from "react";

interface AuthFooterProps {
  text?: string;
  linkText?: string;
  linkHref?: string;
  showTerms?: boolean;
  children?: ReactNode;
}

export default function AuthFooter({
  text,
  linkText,
  linkHref,
  showTerms = true,
  children,
}: AuthFooterProps) {
  return (
    <footer className="mt-8 space-y-4 text-center">
      {(text && linkText && linkHref) && (
        <p className="text-sm text-gray-600">
          {text}{" "}
          <Link
            href={linkHref}
            className="font-semibold text-primary hover:underline"
          >
            {linkText}
          </Link>
        </p>
      )}

      {children}

      {showTerms && (
        <p className="text-xs text-gray-500">
          By continuing, you agree to our{" "}
          <Link
            href="/terms"
            className="hover:underline"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="hover:underline"
          >
            Privacy Policy
          </Link>
          .
        </p>
      )}

      <p className="text-xs text-gray-400">
        © {new Date().getFullYear()} All rights reserved.
      </p>
    </footer>
  );
}