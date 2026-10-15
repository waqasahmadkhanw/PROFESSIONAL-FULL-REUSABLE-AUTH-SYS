"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { BadgeCheck, CalendarDays, Camera, CheckCircle2, ChevronRight, CircleUserRound, Clock3, LogOut, Mail, ShieldCheck, Trash2, UserRound, Check } from "lucide-react";
import { useCurrentUserQuery, useUploadAvatarMutation, useLogout, useDeleteAccount } from "@/modules/auth";
import { useUpdateProfile } from "@/modules/profile";
import { Avatar, Button } from "@/shared/components/ui";
import { useToast } from "@/shared/components/ui/Toast";
import { Loading, ErrorState } from "@/shared/components/feedback";
import { ConfirmDialog } from "@/shared/components/overlay/ConfirmDialog";

interface ProfileFormValues { name: string; email: string; bio: string; phone: string; profession: string; address: string; }

const formatDate = (value?: string) => {
  if (!value) return "Not available";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Not available" : new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(date);
};

/** Authenticated profile management using the existing profile and avatar mutations. */
export default function ProfilePage() {
  const { data: user, isLoading, isError, refetch } = useCurrentUserQuery();
  const { updateProfile, isPending } = useUpdateProfile();
  const uploadAvatarMutation = useUploadAvatarMutation();
  const { logout, isPending: isLogoutPending } = useLogout();
  const { deleteAccount, isPending: isDeletePending } = useDeleteAccount();
  const { success, error: showError } = useToast();
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm<ProfileFormValues>({ defaultValues: { name: "", email: "", bio: "", phone: "", profession: "", address: "" }, mode: "onChange" });

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showSaved, setShowSaved] = useState(false);

  useEffect(() => {
    if (user) reset({ name: user.name ?? "", email: user.email ?? "", bio: user.bio ?? "", phone: user.phone ?? "", profession: user.profession ?? "", address: user.address ?? "" });
  }, [user, reset]);

  const onSubmit = async (values: ProfileFormValues) => {
    try {
      await updateProfile({ name: values.name, bio: values.bio, phone: values.phone, profession: values.profession, address: values.address });
      success("Profile updated");
      setShowSaved(true);
      setTimeout(() => setShowSaved(false), 2000);
    } catch (err) {
      showError((err as Error)?.message ?? "Failed to update profile");
    }
  };

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    try {
      await uploadAvatarMutation.mutateAsync({ avatar: file });
      await refetch();
      success("Profile photo updated");
    } catch (err) {
      showError((err as Error)?.message ?? "Failed to upload photo");
    }
  };

  if (isLoading) return <Loading message="Loading your profile..." />;
  if (isError) return <ErrorState title="Failed to load profile" message="We couldn't load your profile. Please try again." onRetry={() => refetch()} />;

  const inputClass = "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:disabled:bg-slate-800";
  const labelClass = "mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200";
  const roleLabel = user?.role ? `${user.role.charAt(0).toUpperCase()}${user.role.slice(1)}` : "Member";

  return (
    <>
    <main className="min-h-full bg-slate-50 px-4 py-5 sm:px-6 sm:py-7 lg:px-8 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <nav aria-label="Breadcrumb" className="mb-3 flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400"><span>Dashboard</span><ChevronRight className="h-3.5 w-3.5" /><span className="text-violet-700 dark:text-violet-300">Profile</span></nav>
            <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl dark:text-white">My Profile</h1>
            <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">Manage your personal information and account details.</p>
          </div>
          <div className="inline-flex items-center gap-2 self-start rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 sm:self-auto dark:border-emerald-900/70 dark:bg-emerald-950/40 dark:text-emerald-300"><CheckCircle2 className="h-3.5 w-3.5" />{user?.isActivated ? "Account active" : "Account pending activation"}</div>
        </header>

        <section className="overflow-hidden rounded-2xl bg-linear-to-br from-slate-950 via-violet-950 to-violet-800 shadow-sm">
          <div className="relative grid gap-6 p-5 sm:p-7 lg:grid-cols-[auto_1fr_auto] lg:items-center lg:gap-8">
            <div className="pointer-events-none absolute -right-12 -top-20 h-56 w-56 rounded-full bg-violet-400/20 blur-3xl" />
            <div className="relative shrink-0"><Avatar src={user?.avatar ?? undefined} name={user?.name} size="xl" className="h-24 w-24 border-4 border-white/20 bg-violet-100 text-violet-800 shadow-xl" /><input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} /><button type="button" aria-label="Change profile photo" title="Change profile photo" disabled={uploadAvatarMutation.isPending} onClick={() => avatarInputRef.current?.click()} className="absolute -bottom-1 -right-1 inline-flex h-9 w-9 items-center justify-center rounded-full border-2 border-violet-950 bg-white text-violet-700 shadow-md transition hover:scale-105 hover:bg-violet-50 focus:outline-none focus:ring-4 focus:ring-white/30 disabled:cursor-not-allowed disabled:opacity-60"><Camera className="h-4 w-4" /></button></div>
            <div className="relative min-w-0"><div className="flex flex-wrap items-center gap-2"><h2 className="truncate text-xl font-bold text-white">{user?.name || "Unnamed user"}</h2><span className="rounded-full bg-violet-400/15 px-2.5 py-1 text-xs font-semibold text-violet-100 ring-1 ring-inset ring-violet-200/25">{roleLabel}</span></div><p className="mt-1 flex items-center gap-1.5 truncate text-sm text-violet-100/75"><Mail className="h-3.5 w-3.5 shrink-0" />{user?.email}</p><p className="mt-4 max-w-xl text-sm leading-6 text-violet-100/80">{user?.bio || "Add a short bio to help colleagues and learners get to know you."}</p></div>
            <div className="relative grid grid-cols-2 gap-x-5 gap-y-3 border-t border-white/10 pt-5 text-sm sm:max-w-sm lg:border-l lg:border-t-0 lg:pl-7 lg:pt-0"><div><p className="text-xs font-medium text-violet-200/65">Member since</p><p className="mt-1 font-semibold text-white">{formatDate(user?.createdAt)}</p></div><div><p className="text-xs font-medium text-violet-200/65">Last activity</p><p className="mt-1 font-semibold text-white">{formatDate(user?.updatedAt)}</p></div></div>
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="border-b border-slate-100 px-5 py-5 sm:px-6 dark:border-slate-800"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300"><UserRound className="h-5 w-5" /></span><div><h2 className="font-bold text-slate-900 dark:text-white">Profile information</h2><p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">Keep your contact details and public profile current.</p></div></div></div>
            <form onSubmit={handleSubmit(onSubmit)} className="p-5 sm:p-6" noValidate>
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2"><label className={labelClass} htmlFor="name">Full name</label><input id="name" placeholder="Your name" className={inputClass} {...register("name", { required: "Name is required" })} />{errors.name && <p className="mt-1.5 text-xs font-medium text-rose-600">{errors.name.message}</p>}</div>
                <div><label className={labelClass} htmlFor="email">Email address</label><input id="email" type="email" value={user?.email ?? ""} disabled readOnly className={inputClass} /><p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">Email changes are managed separately to protect your account.</p></div>
                <div><label className={labelClass} htmlFor="phone">Phone number</label><input id="phone" placeholder="Add a phone number" className={inputClass} {...register("phone")} />{errors.phone && <p className="mt-1.5 text-xs font-medium text-rose-600">{errors.phone.message}</p>}</div><div><label className={labelClass} htmlFor="profession">Profession</label><input id="profession" placeholder="Your profession" className={inputClass} {...register("profession")} /></div><div><label className={labelClass} htmlFor="address">Address</label><input id="address" placeholder="Your address" className={inputClass} {...register("address")} /></div>
                <div className="sm:col-span-2"><label className={labelClass} htmlFor="bio">Bio</label><textarea id="bio" placeholder="Tell learners and colleagues a little about yourself" rows={4} className={`${inputClass} resize-y`} {...register("bio")} />{errors.bio && <p className="mt-1.5 text-xs font-medium text-rose-600">{errors.bio.message}</p>}</div>
              </div>
              <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800"><p className="text-xs text-slate-500 dark:text-slate-400">Changes are saved securely to your account.</p><Button type="submit" loading={isPending} disabled={!isDirty || isPending} className="bg-violet-600 hover:bg-violet-700 focus-visible:ring-violet-500 transition-all duration-200">{showSaved ? <Check className="h-4 w-4" /> : <span>Save changes</span>}</Button></div>
            </form>
          </section>

          <aside className="space-y-6">
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300"><ShieldCheck className="h-5 w-5" /></span><div><h2 className="font-bold text-slate-900 dark:text-white">Account & security</h2><p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">Your authentication status.</p></div></div><dl className="mt-5 divide-y divide-slate-100 border-y border-slate-100 dark:divide-slate-800 dark:border-slate-800"><div className="flex items-center justify-between gap-4 py-3.5"><dt className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300"><BadgeCheck className="h-4 w-4 text-violet-600" />Account status</dt><dd className={`text-xs font-semibold ${user?.isActivated ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`}>{user?.isActivated ? "Active" : "Pending"}</dd></div><div className="flex items-center justify-between gap-4 py-3.5"><dt className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300"><CircleUserRound className="h-4 w-4 text-violet-600" />Sign-in method</dt><dd className="capitalize text-xs font-semibold text-slate-900 dark:text-white">{user?.provider ?? "Not available"}</dd></div><div className="flex items-center justify-between gap-4 py-3.5"><dt className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300"><Clock3 className="h-4 w-4 text-violet-600" />Last updated</dt><dd className="text-xs font-semibold text-slate-900 dark:text-white">{formatDate(user?.updatedAt)}</dd></div></dl>
              <div className="mt-5 border-t border-slate-100 pt-5 dark:border-slate-800">
                <div className="flex flex-wrap gap-3">
                  <Button variant="ghost" leftIcon={<LogOut className="h-4 w-4" />} onClick={() => setShowLogoutConfirm(true)} loading={isLogoutPending} disabled={isLogoutPending} className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30">
                    Logout
                  </Button>
                  <Button variant="danger" leftIcon={<Trash2 className="h-4 w-4" />} onClick={() => setShowDeleteConfirm(true)} loading={isDeletePending} disabled={isDeletePending}>
                    Delete account
                  </Button>
                </div>
              </div>
            </section>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"><h2 className="font-bold text-slate-900 dark:text-white">Password</h2><p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Update your account password securely.</p><Link href="/change-password" className="mt-4 inline-flex text-sm font-semibold text-violet-700 hover:underline dark:text-violet-300">Change password</Link></div>
            <section className="rounded-2xl border border-violet-100 bg-violet-50/70 p-5 shadow-sm dark:border-violet-900/50 dark:bg-violet-950/20"><div className="flex gap-3"><CalendarDays className="mt-0.5 h-5 w-5 shrink-0 text-violet-700 dark:text-violet-300" /><div><h2 className="font-bold text-slate-900 dark:text-white">Profile photo</h2><p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">Use a clear, professional image so your application community can recognize you.</p><button type="button" disabled={uploadAvatarMutation.isPending} onClick={() => avatarInputRef.current?.click()} className="mt-4 text-sm font-semibold text-violet-700 transition hover:text-violet-900 focus:outline-none focus:underline disabled:cursor-not-allowed disabled:opacity-60 dark:text-violet-300 dark:hover:text-violet-100">{uploadAvatarMutation.isPending ? "Uploading photo…" : "Update profile photo"}</button></div></div></section>
          </aside>
        </div>
      </div>
</main>

      <ConfirmDialog
        open={showLogoutConfirm}
        onOpenChange={setShowLogoutConfirm}
        title="Log out of your account?"
        description="You will be signed out and need to log in again to access your account."
        confirmText="Log out"
        loading={isLogoutPending}
        onConfirm={logout}
      />
      <ConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title="Delete your account?"
        description="This action is irreversible. All your data, including profile information, will be permanently deleted."
        confirmText="Delete account"
        cancelText="Cancel"
        loading={isDeletePending}
        destructive
        onConfirm={deleteAccount}
      />
      
    </>
  );
}
