"use client";

import React from "react";
import { HardDrive, Image as ImageIcon, Video, FileText, Music, Layers } from "lucide-react";
import type { MediaItem } from "../types";

interface MediaStorageBarProps {
  media?: MediaItem[];
  totalCount?: number;
  isLoading?: boolean;
}

function formatBytes(bytes = 0): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function MediaStorageBar({ media = [], totalCount = 0, isLoading }: MediaStorageBarProps) {
  if (isLoading) {
    return (
      <div className="h-20 animate-pulse rounded-2xl border border-slate-200/80 bg-slate-100 dark:border-slate-800 dark:bg-slate-800/50" />
    );
  }

  const totalSize = media.reduce((sum, item) => sum + (item.size || 0), 0);

  // Group size by mediaType
  const imageSize = media.filter((m) => m.mediaType === "image" || m.resourceType === "image").reduce((sum, m) => sum + (m.size || 0), 0);
  const videoSize = media.filter((m) => m.mediaType === "video" || m.resourceType === "video").reduce((sum, m) => sum + (m.size || 0), 0);
  const docSize = media.filter((m) => m.mediaType === "document" || m.resourceType === "raw").reduce((sum, m) => sum + (m.size || 0), 0);
  const audioSize = media.filter((m) => m.mediaType === "audio").reduce((sum, m) => sum + (m.size || 0), 0);
  const safeTotal = totalSize || 1;
  const imagePct = Math.round((imageSize / safeTotal) * 100);
  const videoPct = Math.round((videoSize / safeTotal) * 100);
  const docPct = Math.round((docSize / safeTotal) * 100);
  const audioPct = Math.round((audioSize / safeTotal) * 100);
  const otherPct = Math.max(0, 100 - (imagePct + videoPct + docPct + audioPct));

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs dark:border-slate-800/80 dark:bg-slate-900 space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600 dark:bg-violet-500/20 dark:text-violet-400">
            <HardDrive className="h-4.5 w-4.5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-white">
              Storage Usage
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {totalCount || media.length} total active asset(s) stored on Cloudinary CDN
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs font-bold text-slate-900 dark:text-white">
            {formatBytes(totalSize)}
          </span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
            Loaded asset volume
          </span>
        </div>
      </div>

      {/* Distribution progress bar */}
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800 flex">
        {imagePct > 0 && <div style={{ width: `${imagePct}%` }} className="bg-violet-500 h-full" title={`Images: ${imagePct}%`} />}
        {videoPct > 0 && <div style={{ width: `${videoPct}%` }} className="bg-blue-500 h-full" title={`Videos: ${videoPct}%`} />}
        {docPct > 0 && <div style={{ width: `${docPct}%` }} className="bg-emerald-500 h-full" title={`Documents: ${docPct}%`} />}
        {audioPct > 0 && <div style={{ width: `${audioPct}%` }} className="bg-amber-500 h-full" title={`Audio: ${audioPct}%`} />}
        {otherPct > 0 && <div style={{ width: `${otherPct}%` }} className="bg-slate-400 h-full" title={`Other: ${otherPct}%`} />}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-[11px] font-medium text-slate-600 dark:text-slate-400 pt-1">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-violet-500" />
          <ImageIcon className="h-3 w-3 text-violet-500" />
          <span>Images ({imagePct}%)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-blue-500" />
          <Video className="h-3 w-3 text-blue-500" />
          <span>Videos ({videoPct}%)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          <FileText className="h-3 w-3 text-emerald-500" />
          <span>Docs ({docPct}%)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-amber-500" />
          <Music className="h-3 w-3 text-amber-500" />
          <span>Audio ({audioPct}%)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-slate-400" />
          <Layers className="h-3 w-3 text-slate-400" />
          <span>Other ({otherPct}%)</span>
        </div>
      </div>
    </div>
  );
}
