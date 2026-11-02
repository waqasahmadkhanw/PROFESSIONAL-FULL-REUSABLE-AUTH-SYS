"use client";

import Link from "next/link";
import { Mail, ExternalLink, ArrowUpRight } from "lucide-react";
import { usePublicSettingsQuery } from "@/modules/settings/queries/usePublicSettingsQuery";
import { env } from "@/shared/config/env";

export function PublicFooter() {
  const { data: settings = [] } = usePublicSettingsQuery();

  const getSetting = (key: string) => {
    const setting = settings.find((s) => s.key === key);
    return setting?.value;
  };

  const siteName = (getSetting("site_name") as string) || env.APP_NAME;
  const siteDescription = (getSetting("site_description") as string) || env.APP_DESCRIPTION;
  const footerText = (getSetting("footer_text") as string) || `© ${new Date().getFullYear()} ${siteName}. All rights reserved.`;
  const contactEmail = getSetting("contact_email") as string | undefined;
  const supportEmail = getSetting("support_email") as string | undefined;

  const socialLinks = [
    { label: "Twitter", key: "social_twitter" },
    { label: "LinkedIn", key: "social_linkedin" },
    { label: "GitHub", key: "social_github" },
    { label: "Facebook", key: "social_facebook" },
  ].filter((link) => getSetting(link.key));

  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-slate-200 bg-gradient-to-b from-white to-slate-50 dark:border-slate-800 dark:from-slate-950 dark:to-slate-950/95">
      <div className="mx-auto max-w-screen-2xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <Link href="/" className="inline-flex items-center text-lg font-semibold tracking-tight text-slate-900 transition-colors hover:text-slate-700 dark:text-white dark:hover:text-slate-200">
              {siteName}
            </Link>
            <p className="mt-4 max-w-md text-sm leading-7 text-slate-600 dark:text-slate-400">{siteDescription}</p>
            {(contactEmail || supportEmail) && (
              <div className="mt-6 flex flex-col gap-2">
                {contactEmail && (
                  <a href={`mailto:${contactEmail}`} className="group inline-flex items-center gap-2 text-sm text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
                    <Mail className="h-4 w-4" />
                    <span>{contactEmail}</span>
                    <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
                  </a>
                )}
                {supportEmail && (
                  <a href={`mailto:${supportEmail}`} className="group inline-flex items-center gap-2 text-sm text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
                    <Mail className="h-4 w-4" />
                    <span>{supportEmail}</span>
                    <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
                  </a>
                )}
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-7">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Company</h3>
              <ul className="mt-4 space-y-3">
                <li><Link href="/about" className="text-sm text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">About Us</Link></li>
                <li><Link href="/contact" className="text-sm text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">Contact Us</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Legal</h3>
              <ul className="mt-4 space-y-3">
                <li><Link href="/privacy" className="text-sm text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-sm text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">Terms of Service</Link></li>
              </ul>
            </div>
            {socialLinks.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Connect</h3>
                <ul className="mt-4 space-y-3">
                  {socialLinks.map((link) => {
                    const url = getSetting(link.key) as string;
                    return (
                      <li key={link.key}>
                        <a href={url} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-1.5 text-sm text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
                          {link.label}
                          <ExternalLink className="h-3.5 w-3.5 opacity-70 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
        </div>
        <div className="mt-12 border-t border-slate-200 pt-6 dark:border-slate-800">
          <p className="text-center text-sm text-slate-500 dark:text-slate-400">{footerText.replace(/\d{4}/, currentYear.toString())}</p>
        </div>
      </div>
    </footer>
  );
}

