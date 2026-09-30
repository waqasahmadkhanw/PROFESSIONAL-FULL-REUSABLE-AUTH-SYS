"use client";

import React, { useState, useMemo } from "react";
import { ImageIcon, Upload, X } from "lucide-react";
import { Loading, ErrorState, EmptyState } from "@/shared/components/feedback";
import { Pagination } from "@/shared/components/navigation/Pagination";
import { useToast } from "@/shared/components/ui/Toast/useToast";
import { useMedia } from "../hooks";
import {
  MediaStorageBar,
  MediaFilterBar,
  MediaGrid,
  MediaUploadModal,
  MediaDetailModal,
} from "../components";
import type { MediaItem, UpdateMediaPayload } from "../types";

const PAGE_SIZE = 18;

/**
 * Top-tier SaaS Media Library management page (admin).
 *
 * Provides a high-fidelity asset management canvas with real-time searching,
 * media-type filtering, upload dropzones, storage usage metrics,
 * grid/list views, metadata editing, and single/bulk deletion.
 */
export function MediaPage() {
  const { success, error: showError, info } = useToast();
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [mediaTypeFilter, setMediaTypeFilter] = useState("");
  const [usageFilter, setUsageFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
    uploadFile,
    isUploading,
    updateMedia,
    isUpdating,
    deleteMedia,
    deletingId,
  } = useMedia({
    page,
    limit: PAGE_SIZE,
    mediaType: mediaTypeFilter || undefined,
    usage: usageFilter || undefined,
    search: searchQuery || undefined,
  });

  const rawMedia = data?.media;

  // Client-side filtering & sorting for date range and custom sort orders
  const processedMedia = useMemo(() => {
    let result = rawMedia ? [...rawMedia] : [];

    // Filter by date range
    if (dateFilter !== "all") {
      const now = new Date();
      result = result.filter((item) => {
        if (!item.createdAt) return false;
        const created = new Date(item.createdAt);
        if (dateFilter === "today") {
          return created.toDateString() === now.toDateString();
        } else if (dateFilter === "7days") {
          return (now.getTime() - created.getTime()) / (1000 * 3600 * 24) <= 7;
        } else if (dateFilter === "30days") {
          return (now.getTime() - created.getTime()) / (1000 * 3600 * 24) <= 30;
        }
        return true;
      });
    }

    // Sort order
    result.sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      } else if (sortBy === "oldest") {
        return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
      } else if (sortBy === "name_asc") {
        return (a.filename || "").localeCompare(b.filename || "");
      } else if (sortBy === "name_desc") {
        return (b.filename || "").localeCompare(a.filename || "");
      } else if (sortBy === "size_desc") {
        return (b.size || 0) - (a.size || 0);
      } else if (sortBy === "size_asc") {
        return (a.size || 0) - (b.size || 0);
      }
      return 0;
    });

    return result;
  }, [rawMedia, dateFilter, sortBy]);

  const hasActiveFilters = Boolean(
    searchQuery || mediaTypeFilter || usageFilter || dateFilter !== "all" || sortBy !== "newest"
  );

  const handleResetFilters = () => {
    setSearchQuery("");
    setMediaTypeFilter("");
    setUsageFilter("");
    setDateFilter("all");
    setSortBy("newest");
  };

  // Selection Handlers
  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleToggleSelectAll = () => {
    if (selectedIds.length === processedMedia.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(processedMedia.map((m) => m._id));
    }
  };

  // Single Delete
  const handleDeleteMedia = async (id: string) => {
    try {
      await deleteMedia(id);
      setSelectedIds((prev) => prev.filter((i) => i !== id));
      if (previewItem?._id === id) setPreviewItem(null);
      success("Asset Deleted", "Media file removed from server and storage CDN.");
      refetch();
    } catch (err: unknown) {
      showError("Delete Failed", (err as Error)?.message || "Failed to delete asset.");
    }
  };

  // Bulk Delete
  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    try {
      await Promise.all(selectedIds.map((id) => deleteMedia(id)));
      setSelectedIds([]);
      success("Bulk Deletion Complete", "Successfully deleted selected assets.");
      refetch();
    } catch (err: unknown) {
      showError("Bulk Delete Error", (err as Error)?.message || "Failed to delete selected assets.");
    }
  };

  // Upload handler
  const handleUploadFile = async (
    file: File,
    metadata?: { usage?: string; mediaType?: string; altText?: string }
  ) => {
    try {
      await uploadFile(file, metadata);
      success("File Uploaded", `${file.name} uploaded successfully to CDN.`);
      refetch();
    } catch (err: unknown) {
      showError("Upload Failed", (err as Error)?.message || "Failed to upload file.");
      throw err;
    }
  };

  // Update metadata handler
  const handleUpdateMetadata = async (id: string, payload: UpdateMediaPayload) => {
    try {
      await updateMedia(id, payload);
      success("Metadata Updated", "Media asset details updated successfully.");
      refetch();
    } catch (err: unknown) {
      showError("Update Failed", (err as Error)?.message || "Failed to update asset metadata.");
    }
  };

  const handleCopyUrlToast = () => {
    info("URL Copied", "Direct asset link copied to clipboard.");
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Filter Bar & Header Controls */}
      <MediaFilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        mediaTypeFilter={mediaTypeFilter}
        setMediaTypeFilter={setMediaTypeFilter}
        usageFilter={usageFilter}
        setUsageFilter={setUsageFilter}
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
        viewMode={viewMode}
        setViewMode={setViewMode}
        isRefetching={Boolean(isRefetching)}
        onRefresh={() => refetch()}
        onOpenUpload={() => setIsUploadOpen(true)}
        onReset={handleResetFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {/* 2. Storage Metrics Bar */}
      <MediaStorageBar
        media={rawMedia}
        totalCount={data?.pagination?.total}
        isLoading={isLoading}
      />

      {/* 3. Media Asset Canvas & Feedbacks */}
      <div className="space-y-4">
        {isLoading ? (
          <Loading message="Loading media library assets..." />
        ) : isError ? (
          <ErrorState
            title="Failed to load media assets"
            message={error?.message ?? "The media API is currently unavailable."}
            onRetry={() => refetch()}
          />
        ) : processedMedia.length > 0 ? (
          <>
            <MediaGrid
              media={processedMedia}
              viewMode={viewMode}
              onPreview={setPreviewItem}
              onDelete={handleDeleteMedia}
              onCopyUrl={handleCopyUrlToast}
              selectedIds={selectedIds}
              onToggleSelect={handleToggleSelect}
              onToggleSelectAll={handleToggleSelectAll}
              onBulkDelete={handleBulkDelete}
              deletingId={deletingId}
            />

            {data?.pagination && data.pagination.pages > 1 && (
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs dark:border-slate-800/80 dark:bg-slate-900 text-xs">
                <span className="text-slate-500 dark:text-slate-400 font-medium">
                  Page {data.pagination.page} of {data.pagination.pages} ({data.pagination.total} Total Media Files)
                </span>
                <Pagination
                  page={page}
                  totalPages={data.pagination.pages}
                  onPageChange={setPage}
                />
              </div>
            )}
          </>
        ) : (
          <div className="rounded-2xl border border-slate-200/80 bg-white p-12 text-center shadow-2xs dark:border-slate-800/80 dark:bg-slate-900">
            <EmptyState
              icon={<ImageIcon className="h-10 w-10 text-slate-300 dark:text-slate-700" />}
              title="No media files found"
              description={
                hasActiveFilters
                  ? "No asset records match your active search query or filter criteria."
                  : "Upload your first image, video, audio, or document asset to start building your library."
              }
              action={
                hasActiveFilters ? (
                  <button
                    onClick={handleResetFilters}
                    className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-violet-600 px-4 py-2 text-xs font-bold text-white hover:bg-violet-700 transition-all"
                  >
                    <X className="h-3.5 w-3.5" />
                    <span>Clear Active Filters</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setIsUploadOpen(true)}
                    className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-violet-600 px-4 py-2 text-xs font-bold text-white hover:bg-violet-700 transition-all"
                  >
                    <Upload className="h-4 w-4" />
                    <span>Upload First Asset</span>
                  </button>
                )
              }
            />
          </div>
        )}
      </div>

      {/* 4. Upload Modal */}
      <MediaUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUpload={handleUploadFile}
        isUploading={isUploading}
      />

      {/* 5. Detail Inspection Modal */}
      <MediaDetailModal
        item={previewItem}
        onClose={() => setPreviewItem(null)}
        onDelete={handleDeleteMedia}
        onUpdate={handleUpdateMetadata}
        isUpdating={isUpdating}
      />
    </div>
  );
}

export default MediaPage;
