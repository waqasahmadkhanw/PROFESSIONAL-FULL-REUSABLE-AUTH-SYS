"use client";

import { ReactNode } from "react";
import { useGuestGuard } from "@/modules/auth";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({
  children,
}: LayoutProps) {
  useGuestGuard();

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-12 font-sans text-slate-100">
      {/* Ambient background glow orbs */}
      <div className="pointer-events-none absolute -top-32 -left-20 h-96 w-96 rounded-full bg-indigo-600/20 blur-[120px] animate-pulse-glow" />
      <div className="pointer-events-none absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-violet-600/20 blur-[120px]" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-[140px]" />

      {/* Grid pattern overlay */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-25" />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-lg">
        {children}
      </div>
    </div>
  );
}
