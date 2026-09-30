/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";
import {
  X,
  Copy,
  Check,
  Download,
  Trash2,
  Image as ImageIcon,
  FileText,
  Music,
  ExternalLink,
  Edit2,
  Save,
} from "lucide-react";
import type { MediaItem, UpdateMediaPayload } from "../types";
import { formatDate } from "@/shared/lib/date";

interface MediaDetailModalProps {
  item: MediaItem | null;
  onClose: () => void;
  onDelete: (id: string) => Promise<void>;
  onUpdate?: (id: string, payload: UpdateMediaPayload) => Promise<void>;
  isUpdating?: boolean;
}

function formatBytes(bytes = 0): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function MediaDetailModal({
  item,
  onClose,
  onDelete,
  onUpdate,
  isUpdating,
}: MediaDetailModalProps) {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [altText, setAltText] = useState(item?.altText || "");
  const [usage, setUsage] = useState(item?.usage || "general");
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  if (!item) return null;

  const targetUrl = item.secureUrl || item.url;
  const mediaType = (item.mediaType || item.resourceType || "other").toLowerCase();
  const uploaderName = typeof item.uploadedBy === "object" ? item.uploadedBy?.name : "N/A";
  const uploaderEmail = typeof item.uploadedBy === "object" ? item.uploadedBy?.email : "";

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(targetUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveMetadata = async () => {
    if (onUpdate) {
      await onUpdate(item._id, { altText, usage });
      setIsEditing(false);
    }
  };

  const handleDeleteConfirm = async () => {
    await onDelete(item._id);
    setShowConfirmDelete(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4 dark:border-slate-800/80 dark:bg-slate-800/40">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600 dark:bg-violet-500/20 dark:text-violet-400">
              <ImageIcon className="h-4.5 w-4.5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-bold text-slate-900 dark:text-white truncate max-w-md">
                {item.filename || "Media Asset"}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                ID: {item.publicId || item._id}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body - Split View */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-100 dark:divide-slate-800">

          {/* Left: Large Preview Stage (8 cols) */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center p-6 bg-slate-950/90 text-white min-h-[300px]">
            {mediaType === "image" && targetUrl ? (
              <img
                src={targetUrl}
                alt={item.altText || item.filename || "Preview"}
                className="max-h-[450px] w-auto max-w-full rounded-xl object-contain shadow-md"
              />
            ) : mediaType === "video" && targetUrl ? (
              <video
                controls
                src={targetUrl}
                className="max-h-[450px] w-full rounded-xl shadow-md"
              >
                Your browser does not support video playback.
              </video>
            ) : mediaType === "audio" && targetUrl ? (
              <div className="w-full space-y-4 p-8 text-center">
                <Music className="mx-auto h-16 w-16 text-amber-400 animate-pulse" />
                <audio controls src={targetUrl} className="w-full">
                  Your browser does not support audio playback.
                </audio>
              </div>
            ) : (
              <div className="text-center space-y-3 p-8">
                <FileText className="mx-auto h-16 w-16 text-emerald-400" />
                <p className="text-sm font-semibold text-slate-300">
                  {item.filename || "Document file"}
                </p>
                <a
                  href={targetUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-500 transition-all"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>Open Document</span>
                </a>
              </div>
            )}
          </div>

          {/* Right: Metadata & Actions Sidebar (5 cols) */}
          <div className="lg:col-span-5 p-6 space-y-6 bg-white dark:bg-slate-900">

            {/* Quick Actions Header */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyUrl}
                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200/80 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 transition-all"
              >
                {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                <span>{copied ? "Copied Link!" : "Copy Direct URL"}</span>
              </button>

              <a
                href={targetUrl}
                target="_blank"
                rel="noreferrer"
                download
                className="inline-flex items-center justify-center rounded-xl bg-violet-50 p-2 text-violet-600 hover:bg-violet-100 dark:bg-violet-950/60 dark:text-violet-400 transition-all"
                title="Download Original"
              >
                <Download className="h-4.5 w-4.5" />
              </a>
            </div>

            {/* Technical Metadata */}
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-800/40 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Asset Metadata
              </h4>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">File Size</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {formatBytes(item.size)}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px]">Format / Extension</span>
                  <span className="font-bold text-slate-900 dark:text-white uppercase">
                    {item.format || mediaType}
                  </span>
                </div>

                {item.width && item.height ? (
                  <div>
                    <span className="text-slate-400 block text-[10px]">Dimensions</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {item.width} × {item.height} px
                    </span>
                  </div>
                ) : null}

                <div>
                  <span className="text-slate-400 block text-[10px]">Created Date</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {item.createdAt ? formatDate(item.createdAt) : "N/A"}
                  </span>
                </div>
              </div>

              {uploaderName && (
                <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-xs">
                  <span className="text-slate-400 block text-[10px]">Uploaded By</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {uploaderName} {uploaderEmail ? `(${uploaderEmail})` : ""}
                  </span>
                </div>
              )}
            </div>

            {/* Editable Metadata Form */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Usage & Alt Text
                </h4>
                {onUpdate && !isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-violet-600 dark:text-violet-400 hover:underline"
                  >
                    <Edit2 className="h-3 w-3" />
                    <span>Edit</span>
                  </button>
                )}
              </div>

              {isEditing ? (
                <div className="space-y-3 rounded-2xl border border-violet-200 bg-violet-50/40 p-3.5 dark:border-violet-900/50 dark:bg-violet-950/20">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Alt Text
                    </label>
                    <input
                      type="text"
                      value={altText}
                      onChange={(e) => setAltText(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-900 focus:border-violet-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Usage Context
                    </label>
                    <select
                      value={usage}
                      onChange={(e) => setUsage(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-900 focus:border-violet-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    >
                      <option value="general">General Media</option>
                      <option value="avatar">User Avatar</option>
                    </select>
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="rounded-lg border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveMetadata}
                      disabled={isUpdating}
                      className="inline-flex items-center gap-1 rounded-lg bg-violet-600 px-3 py-1 text-xs font-bold text-white hover:bg-violet-700 disabled:opacity-50"
                    >
                      <Save className="h-3 w-3" />
                      <span>{isUpdating ? "Saving..." : "Save Changes"}</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-slate-200/80 p-4 dark:border-slate-800 space-y-2 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Alt Description</span>
                    <span className="font-medium text-slate-900 dark:text-white">
                      {item.altText || "No description set"}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Usage Category</span>
                    <span className="inline-block mt-0.5 rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300 capitalize">
                      {item.usage || "general"}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Danger Zone - Delete */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80">
              {!showConfirmDelete ? (
                <button
                  onClick={() => setShowConfirmDelete(true)}
                  className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-xs font-bold text-rose-700 hover:bg-rose-100 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300 transition-all"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Delete Asset from CDN</span>
                </button>
              ) : (
                <div className="rounded-2xl border border-rose-200 bg-rose-50/80 p-3.5 text-center dark:border-rose-900/50 dark:bg-rose-950/60 space-y-2">
                  <p className="text-xs font-bold text-rose-800 dark:text-rose-200">
                    Are you sure? This cannot be undone.
                  </p>
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={handleDeleteConfirm}
                      className="rounded-lg bg-rose-600 px-3 py-1 text-xs font-bold text-white hover:bg-rose-700"
                    >
                      Confirm Delete
                    </button>
                    <button
                      onClick={() => setShowConfirmDelete(false)}
                      className="rounded-lg border border-slate-300 bg-white px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
