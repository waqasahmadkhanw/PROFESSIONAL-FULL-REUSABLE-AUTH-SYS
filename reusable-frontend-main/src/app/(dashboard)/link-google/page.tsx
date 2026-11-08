"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Link as LinkIcon } from "lucide-react";
import { useLinkGoogle, useUnlinkGoogle } from "@/modules/auth";
import { Button } from "@/shared/components/ui";
import { useToast } from "@/shared/components/ui/Toast";

export default function LinkGooglePage() {
  const router = useRouter();
  const { linkGoogle, isPending: isLinking } = useLinkGoogle();
  const { unlinkGoogle, isPending: isUnlinking } = useUnlinkGoogle();
  const { success, error } = useToast();

  const [isLinked, setIsLinked] = useState(false);

  const handleLink = async (credential: string) => {
    try {
      await linkGoogle(credential);
      success("Google account linked successfully");
      setIsLinked(true);
      router.push("/profile");
    } catch (err) {
      error((err as Error)?.message ?? "Failed to link Google account");
    }
  };

  const handleUnlink = async () => {
    try {
      await unlinkGoogle();
      success("Google account unlinked successfully");
      setIsLinked(false);
    } catch (err) {
      error((err as Error)?.message ?? "Failed to unlink Google account");
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 dark:bg-slate-950">
      <div className="mx-auto max-w-xl">
        <Button variant="secondary" onClick={() => router.back()} leftIcon={<ArrowLeft className="h-4 w-4" />}>Back</Button>
        <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-6 flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300"><LinkIcon className="h-5 w-5" /></span>
            <div><h1 className="text-xl font-bold text-slate-900 dark:text-white">Link Google Account</h1><p className="text-sm text-slate-500 dark:text-slate-400">Connect your Google account for faster sign-in.</p></div>
          </div>
          {isLinked ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 rounded-xl border border-green-100 bg-green-50 text-sm text-green-900 dark:border-green-900/20 dark:bg-green-900/10 dark:text-green-100">
                <LinkIcon className="h-5 w-5 text-green-600" />
                <span>Google account is linked.</span>
              </div>
              <Button variant="outline" className="w-full" onClick={handleUnlink}>
                Unlink Google Account
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center dark:border-slate-700">
                <LinkIcon className="mx-auto h-8 w-8 text-slate-400" />
                <h3 className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">Link with Google</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Sign in with Google to link your account.</p>
              </div>
              <Button className="w-full flex items-center justify-center gap-2 border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700" disabled={isLinking} onClick={() => handleLink("")}>
                {isLinking ? "Linking..." : "Continue with Google"}
              </Button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
