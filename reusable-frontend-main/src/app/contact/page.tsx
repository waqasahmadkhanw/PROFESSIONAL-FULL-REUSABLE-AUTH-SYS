"use client";

import { useState } from "react";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { Button, Input, Textarea } from "@/shared/components/ui";
import { useToast } from "@/shared/components/ui/Toast";
import { apiClient } from "@/shared/api";
import { usePublicSettingsQuery } from "@/modules/settings/queries/usePublicSettingsQuery";
import { env } from "@/shared/config/env";
import { PublicHeader, PublicFooter } from "@/shared/components/layout";

export default function ContactPage() {
  const { success, error: showError } = useToast();
  const { data: settings = [], isLoading } = usePublicSettingsQuery();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const getSetting = (key: string) => {
    const setting = settings.find((s) => s.key === key);
    return setting?.value as string | undefined;
  };

  const contactTitle = getSetting("contact_title") || "Contact Us";
  const contactDescription = getSetting("contact_description") || "We'd love to hear from you. Send us a message and we'll respond as soon as possible.";
  const contactEmail = getSetting("contact_email") || env.APP_NAME;
  const contactPhone = getSetting("contact_phone");
  const contactAddress = getSetting("contact_address");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      await apiClient.post("/contact", formData);
      success("Message sent successfully");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      const message = (err as { message?: string })?.message || "Failed to send message";
      showError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <>
        <PublicHeader />
        <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="mx-auto h-8 w-48 rounded bg-slate-200 dark:bg-slate-800" />
            <div className="mx-auto h-4 w-96 rounded bg-slate-200 dark:bg-slate-800" />
            <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
              <div className="h-64 rounded-2xl bg-slate-200 dark:bg-slate-800" />
              <div className="h-96 rounded-2xl bg-slate-200 dark:bg-slate-800" />
            </div>
          </div>
        </main>
        <PublicFooter />
      </>
    );
  }

  return (
    <>
      <PublicHeader />
      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <header className="mb-10 space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">{contactTitle}</h1>
          <p className="mx-auto max-w-2xl text-base text-slate-500 dark:text-slate-400">{contactDescription}</p>
        </header>

        <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
          <section className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">Get in touch</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
                    <Mail className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">Email</p>
                    <a href={`mailto:${contactEmail}`} className="text-sm text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">{contactEmail}</a>
                  </div>
                </div>
                {contactPhone && (
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
                      <Phone className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">Phone</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{contactPhone}</p>
                    </div>
                  </div>
                )}
                {contactAddress && (
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
                      <MapPin className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">Address</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{contactAddress}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-slate-900 dark:text-white">Name</label>
                  <Input id="name" name="name" value={formData.name} onChange={handleChange} required maxLength={100} />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-slate-900 dark:text-white">Email</label>
                  <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required maxLength={150} />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium text-slate-900 dark:text-white">Subject</label>
                <Input id="subject" name="subject" value={formData.subject} onChange={handleChange} required maxLength={200} />
              </div>
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-slate-900 dark:text-white">Message</label>
                <Textarea id="message" name="message" value={formData.message} onChange={handleChange} required rows={6} maxLength={2000} />
              </div>
              <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                <Send className="mr-2 h-4 w-4" />
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </section>
        </div>
      </main>
      <PublicFooter />
    </>
  );
}
