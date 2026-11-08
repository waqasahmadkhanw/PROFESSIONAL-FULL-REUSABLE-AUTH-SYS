"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Mail } from "lucide-react";
import { usePublicSettingsQuery } from "@/modules/settings/queries/usePublicSettingsQuery";
import { env } from "@/shared/config/env";

export function PublicHeader() {
  const { data: settings = [] } = usePublicSettingsQuery();
  const pathname = usePathname();

  const getSetting = (key: string) => {
    const setting = settings.find((s) => s.key === key);
    return setting?.value;
  };

  const siteName = (getSetting("site_name") as string) || env.APP_NAME;
  const siteDescription = (getSetting("site_description") as string) || env.APP_DESCRIPTION;
  const contactEmail = getSetting("contact_email") as string | undefined;

  const navLinks = [
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/95">
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            {siteName}
          </Link>
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium transition-colors"
                  {...(active
                    ? { className: "text-slate-900 font-semibold dark:text-white" }
                    : { className: "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white" })}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
          <div className="flex items-center gap-3 lg:gap-4">
            {contactEmail && (
              <a
                href={`mailto:${contactEmail}`}
                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 dark:text-white transition-colors"
              >
                <Mail className="h-4 w-4" />
                Contact
              </a>
            )}
            <button
              className="inline-flex items-center justify-center rounded-md text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 transition-colors"
              aria-label="Main menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
