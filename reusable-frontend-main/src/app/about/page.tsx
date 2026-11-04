"use client";

import { useEffect, useState } from "react";
import { env } from "@/shared/config/env";
import { getPublicSettingsApi } from "@/modules/settings/api/setting.api";

export default function AboutPage() {
  const [settings, setSettings] = useState<Array<{ key: string; value: unknown }>>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getPublicSettingsApi()
      .then(setSettings)
      .catch(() => setSettings([]))
      .finally(() => setIsLoading(false));
  }, []);

  const getSetting = (key: string) => {
    const setting = settings.find((s) => s.key === key);
    return setting?.value;
  };

  const aboutTitle = (getSetting("about_title") as string) || `About ${env.APP_NAME}`;
  const aboutContent = (getSetting("about_content") as string) || `${env.APP_NAME} is a reusable full-stack application template.`;
  const aboutMission = getSetting("about_mission") as string | undefined;
  const aboutVision = getSetting("about_vision") as string | undefined;

  if (isLoading) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-32 rounded-2xl bg-slate-200 dark:bg-slate-800" />
        </div>
      </main>
    );
  }

  return (
  <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
    <header className="mb-8 space-y-2">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">{aboutTitle}</h1>
    </header>
      <section className="space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="prose prose-slate max-w-none dark:prose-invert">
            <p className="whitespace-pre-wrap text-sm leading-7 text-slate-600 dark:text-slate-300">{aboutContent}</p>
          </div>
        </div>
        {(aboutMission || aboutVision) && (
          <div className="grid gap-6 md:grid-cols-2">
            {aboutMission && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <h2 className="mb-3 text-lg font-semibold text-slate-900 dark:text-white">Our Mission</h2>
                <p className="whitespace-pre-wrap text-sm leading-7 text-slate-600 dark:text-slate-300">{aboutMission}</p>
              </div>
            )}
            {aboutVision && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <h2 className="mb-3 text-lg font-semibold text-slate-900 dark:text-white">Our Vision</h2>
                <p className="whitespace-pre-wrap text-sm leading-7 text-slate-600 dark:text-slate-300">{aboutVision}</p>
              </div>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
