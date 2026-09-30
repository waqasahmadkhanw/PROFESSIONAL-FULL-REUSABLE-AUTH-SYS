/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";
import {
  Image as ImageIcon,
  Video,
  FileText,
  Music,
  Trash2,
  Eye,
  Copy,
  Check,
  Download,
  Play,
} from "lucide-react";
import type { MediaItem } from "../types";
import { formatDate } from "@/shared/lib/date";

interface MediaCardProps {
  item: MediaItem;
  onPreview: (item: MediaItem) => void;
  onDelete: (id: string) => void;
  onCopyUrl: (url: string) => void;
  isSelected?: boolean;
  onToggleSelect?: (id: string) => void;
  isDeleting?: boolean;
}

function formatBytes(bytes = 0): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function MediaCard({
  item,
  onPreview,
  onDelete,
  onCopyUrl,
  isSelected = false,
  onToggleSelect,
  isDeleting = false,
}: MediaCardProps) {
  const [imgError, setImgError] = useState(false);
  const [copied, setCopied] = useState(false);

  const mediaType = (item.mediaType || item.resourceType || "other").toLowerCase();
  const fileExt = item.format || item.filename?.split(".").pop() || mediaType;

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    const targetUrl = item.secureUrl || item.url;
    navigator.clipboard.writeText(targetUrl);
    setCopied(true);
    onCopyUrl(targetUrl);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    const targetUrl = item.secureUrl || item.url;
    window.open(targetUrl, "_blank");
  };

  return (
    <div
      className={`group relative flex flex-col overflow-hidden rounded-2xl border transition-all duration-200 hover:shadow-md dark:bg-slate-900 ${
        isSelected
          ? "border-violet-500 bg-violet-50/20 ring-2 ring-violet-500/20 dark:border-violet-400 dark:bg-violet-950/20"
          : "border-slate-200/80 bg-white hover:border-slate-300 dark:border-slate-800/80 dark:hover:border-slate-700"
      }`}
    >
      {/* Top Preview Area */}
      <div className="relative aspect-16/10 w-full overflow-hidden bg-slate-100 dark:bg-slate-800/60 flex items-center justify-center">
        {/* Checkbox */}
        <div className="absolute left-3 top-3 z-20">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onToggleSelect?.(item._id)}
            className="h-4 w-4 rounded-md border-slate-300 text-violet-600 focus:ring-violet-500 dark:border-slate-700 dark:bg-slate-800 cursor-pointer shadow-2xs"
          />
        </div>

        {/* Media Type Badge */}
        <div className="absolute right-3 top-3 z-20">
          <span className="inline-flex items-center rounded-lg bg-slate-900/70 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-xs">
            {fileExt}
          </span>
        </div>

        {/* Preview Content */}
        {mediaType === "image" && item.url && !imgError ? (
          <img
            src={item.secureUrl || item.url}
            alt={item.altText || item.filename || "Media asset"}
            onError={() => setImgError(true)}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : mediaType === "video" ? (
          <div className="relative flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-violet-300">
            <Video className="h-10 w-10 text-violet-400/80" />
            <div className="absolute inset-0 flex items-center justify-center bg-slate-950/30">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-600/90 text-white shadow-lg backdrop-blur-xs group-hover:scale-110 transition-transform">
                <Play className="h-4 w-4 fill-current ml-0.5" />
              </div>
            </div>
          </div>
        ) : mediaType === "audio" ? (
          <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-slate-900 text-amber-500">
            <Music className="h-10 w-10" />
            <span className="mt-1 text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Audio File
            </span>
          </div>
        ) : mediaType === "document" || item.resourceType === "raw" ? (
          <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-slate-900 text-emerald-500">
            <FileText className="h-10 w-10" />
            <span className="mt-1 text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Document
            </span>
          </div>
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center bg-slate-100 text-slate-400 dark:bg-slate-800">
            <ImageIcon className="h-10 w-10" />
            <span className="mt-1 text-[10px] font-medium text-slate-500">
              Media Asset
            </span>
          </div>
        )}

        {/* Hover Quick Action Overlay */}
        <div className="absolute inset-0 z-10 flex items-center justify-center gap-2 bg-slate-950/60 opacity-0 transition-opacity duration-200 backdrop-blur-2xs group-hover:opacity-100">
          <button
            type="button"
            onClick={() => onPreview(item)}
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/90 text-slate-800 shadow-sm hover:bg-white hover:text-violet-600 dark:bg-slate-900/90 dark:text-slate-200 dark:hover:text-violet-400 transition-all"
            title="Preview Asset"
          >
            <Eye className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/90 text-slate-800 shadow-sm hover:bg-white hover:text-violet-600 dark:bg-slate-900/90 dark:text-slate-200 dark:hover:text-violet-400 transition-all"
            title="Copy Direct URL"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
          </button>

          <button
            type="button"
            onClick={handleDownload}
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/90 text-slate-800 shadow-sm hover:bg-white hover:text-violet-600 dark:bg-slate-900/90 dark:text-slate-200 dark:hover:text-violet-400 transition-all"
            title="Download File"
          >
            <Download className="h-4 w-4" />
          </button>

          <button
            type="button"
            disabled={isDeleting}
            onClick={(e) => {
              e.stopPropagation();
              onDelete(item._id);
            }}
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-600 text-white shadow-sm hover:bg-rose-700 transition-all disabled:opacity-50"
            title="Delete Asset"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Card Info Details */}
      <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
        <div>
          <h4
            className="text-xs font-bold text-slate-900 dark:text-white truncate"
            title={item.filename || "Untitled asset"}
          >
            {item.filename || "Untitled asset"}
          </h4>

          <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span>{formatBytes(item.size)}</span>
            {item.width && item.height ? (
              <span>{item.width}×{item.height}</span>
            ) : (
              <span className="capitalize">{item.usage || "general"}</span>
            )}
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
          <span>{item.createdAt ? formatDate(item.createdAt) : "Recently"}</span>
          {typeof item.uploadedBy === "object" && item.uploadedBy?.name && (
            <span className="truncate max-w-[90px]">{item.uploadedBy.name}</span>
          )}
        </div>
      </div>
    </div>
  );
}
