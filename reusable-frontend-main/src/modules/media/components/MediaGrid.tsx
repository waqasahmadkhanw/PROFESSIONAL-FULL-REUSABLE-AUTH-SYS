/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import {
  Trash2,
  Eye,
  Copy,
  Download,
  FileText,
  Video,
  Music,
} from "lucide-react";
import type { MediaItem } from "../types";
import { MediaCard } from "./MediaCard";
import { formatDate } from "@/shared/lib/date";

interface MediaGridProps {
  media: MediaItem[];
  viewMode: "grid" | "list";
  onPreview: (item: MediaItem) => void;
  onDelete: (id: string) => void;
  onCopyUrl: (url: string) => void;
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  onBulkDelete?: () => void;
  deletingId?: unknown;
}

function formatBytes(bytes = 0): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function MediaGrid({
  media,
  viewMode,
  onPreview,
  onDelete,
  onCopyUrl,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  onBulkDelete,
  deletingId,
}: MediaGridProps) {
  const isAllSelected = media.length > 0 && selectedIds.length === media.length;

  return (
    <div className="space-y-4">
      {/* Selection Action Header */}
      {selectedIds.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-violet-50 px-4 py-2.5 text-xs font-semibold text-violet-800 dark:bg-violet-950/60 dark:text-violet-200 border border-violet-200/80 dark:border-violet-800/80 shadow-2xs">
          <div className="flex items-center gap-3">
            <span>{selectedIds.length} asset(s) selected</span>
            <button
              onClick={onToggleSelectAll}
              className="text-xs font-bold text-violet-600 dark:text-violet-400 hover:underline"
            >
              Clear Selection
            </button>
          </div>

          {onBulkDelete && (
            <button
              onClick={onBulkDelete}
              className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-rose-700 shadow-2xs transition-all"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Delete Selected ({selectedIds.length})</span>
            </button>
          )}
        </div>
      )}

      {/* GRID VIEW */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {media.map((item) => (
            <MediaCard
              key={item._id}
              item={item}
              onPreview={onPreview}
              onDelete={onDelete}
              onCopyUrl={onCopyUrl}
              isSelected={selectedIds.includes(item._id)}
              onToggleSelect={onToggleSelect}
              isDeleting={deletingId === item._id}
            />
          ))}
        </div>
      ) : (
        /* LIST VIEW */
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-2xs dark:border-slate-800/80 dark:bg-slate-900">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:bg-slate-800/50 dark:border-slate-800/80 dark:text-slate-400">
                <tr>
                  <th className="w-10 px-4 py-3.5">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={onToggleSelectAll}
                      className="h-4 w-4 rounded-md border-slate-300 text-violet-600 focus:ring-violet-500 dark:border-slate-700 dark:bg-slate-800"
                    />
                  </th>
                  <th className="px-4 py-3.5">Asset</th>
                  <th className="px-4 py-3.5">Type</th>
                  <th className="px-4 py-3.5">Usage</th>
                  <th className="px-4 py-3.5">Size</th>
                  <th className="px-4 py-3.5">Uploaded Date</th>
                  <th className="px-4 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 bg-white dark:bg-slate-900">
                {media.map((item) => {
                  const isSelected = selectedIds.includes(item._id);
                  const mType = (item.mediaType || item.resourceType || "other").toLowerCase();

                  return (
                    <tr
                      key={item._id}
                      className={`group transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/40 ${
                        isSelected ? "bg-violet-50/30 dark:bg-violet-950/20" : ""
                      }`}
                    >
                      <td className="px-4 py-3.5">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => onToggleSelect(item._id)}
                          className="h-4 w-4 rounded-md border-slate-300 text-violet-600 focus:ring-violet-500 dark:border-slate-700 dark:bg-slate-800"
                        />
                      </td>

                      {/* Asset Preview + Name */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200/80 dark:border-slate-800">
                            {mType === "image" && item.url ? (
                              <img src={item.secureUrl || item.url} alt="" className="h-full w-full object-cover" />
                            ) : mType === "video" ? (
                              <Video className="h-5 w-5 text-blue-500" />
                            ) : mType === "audio" ? (
                              <Music className="h-5 w-5 text-amber-500" />
                            ) : (
                              <FileText className="h-5 w-5 text-emerald-500" />
                            )}
                          </div>

                          <div className="min-w-0 max-w-[200px] sm:max-w-[300px]">
                            <p className="font-bold text-slate-900 dark:text-white truncate">
                              {item.filename || "Untitled media"}
                            </p>
                            <p className="text-[10px] text-slate-400 font-mono truncate">
                              {item.publicId || item._id}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Type */}
                      <td className="px-4 py-3.5">
                        <span className="inline-flex items-center rounded-lg bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300 uppercase">
                          {item.format || mType}
                        </span>
                      </td>

                      {/* Usage */}
                      <td className="px-4 py-3.5 text-slate-600 dark:text-slate-300 capitalize">
                        {item.usage || "general"}
                      </td>

                      {/* Size */}
                      <td className="px-4 py-3.5 font-medium text-slate-900 dark:text-white">
                        {formatBytes(item.size)}
                      </td>

                      {/* Date */}
                      <td className="px-4 py-3.5 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                        {item.createdAt ? formatDate(item.createdAt) : "N/A"}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onPreview(item)}
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white transition-all"
                            title="Preview Asset"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>

                          <button
                            onClick={() => onCopyUrl(item.secureUrl || item.url)}
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white transition-all"
                            title="Copy URL"
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </button>

                          <button
                            onClick={() => window.open(item.secureUrl || item.url, "_blank")}
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white transition-all"
                            title="Download"
                          >
                            <Download className="h-3.5 w-3.5" />
                          </button>

                          <button
                            onClick={() => onDelete(item._id)}
                            className="inline-flex items-center rounded-lg border border-rose-200 bg-rose-50 px-2 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300 transition-all"
                            title="Delete"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
