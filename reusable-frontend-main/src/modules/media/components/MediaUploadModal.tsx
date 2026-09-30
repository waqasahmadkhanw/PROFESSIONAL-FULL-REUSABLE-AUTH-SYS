"use client";

import React, { useRef, useState } from "react";
import {
  Upload,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";

interface MediaUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File, metadata?: { usage?: string; mediaType?: string; altText?: string }) => Promise<void>;
  isUploading?: boolean;
}

export function MediaUploadModal({
  isOpen,
  onClose,
  onUpload,
  isUploading,
}: MediaUploadModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [usage, setUsage] = useState("general");
  const [altText, setAltText] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      setErrorMsg("");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setErrorMsg("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setErrorMsg("Please select a file to upload.");
      return;
    }

    try {
      // Deduce mediaType from file mime type
      let mediaType = "other";
      if (selectedFile.type.startsWith("image/")) mediaType = "image";
      else if (selectedFile.type.startsWith("video/")) mediaType = "video";
      else if (selectedFile.type.startsWith("audio/")) mediaType = "audio";
      else if (selectedFile.type.includes("pdf") || selectedFile.type.includes("document")) mediaType = "document";

      await onUpload(selectedFile, { usage, mediaType, altText });
      setSelectedFile(null);
      setAltText("");
      setUsage("general");
      onClose();
    } catch (err: unknown) {
      setErrorMsg((err as Error)?.message || "Upload failed. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4 dark:border-slate-800/80 dark:bg-slate-800/40">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600 dark:bg-violet-500/20 dark:text-violet-400">
              <Upload className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Upload New Asset
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Upload images, videos, audio, or document files to the configured storage provider.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isUploading}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {errorMsg && (
            <div className="flex items-center gap-2 rounded-xl bg-rose-50 p-3 text-xs font-semibold text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200/80 dark:border-rose-900/50">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Dropzone */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center cursor-pointer transition-all duration-200 ${
              dragActive
                ? "border-violet-500 bg-violet-50/50 dark:bg-violet-950/30"
                : selectedFile
                ? "border-emerald-500/80 bg-emerald-50/20 dark:bg-emerald-950/20"
                : "border-slate-300 bg-slate-50/50 hover:border-violet-400 hover:bg-slate-100/60 dark:border-slate-700 dark:bg-slate-800/40 dark:hover:border-violet-500"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              className="hidden"
            />

            {selectedFile ? (
              <div className="space-y-2">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Ready to upload
                </p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFile(null);
                  }}
                  className="mt-2 text-xs font-semibold text-rose-600 hover:underline"
                >
                  Change file
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 text-violet-600 dark:bg-violet-950/60 dark:text-violet-400">
                  <Upload className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    Drag and drop file here, or <span className="text-violet-600 dark:text-violet-400">browse</span>
                  </p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Supports JPG, PNG, WEBP, MP4, PDF, MP3, DOCX up to 50MB
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Usage & Alt Text Fields */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Usage Context
              </label>
              <select
                value={usage}
                onChange={(e) => setUsage(e.target.value)}
                className="w-full rounded-xl border border-slate-200/80 bg-slate-50/50 px-3 py-2 text-xs font-semibold text-slate-900 focus:border-violet-500 focus:bg-white focus:outline-hidden dark:border-slate-800 dark:bg-slate-800 dark:text-white"
              >
                <option value="general">General Asset</option>
                <option value="content">Content Asset</option>
                <option value="document">Document</option>
                <option value="avatar">User Avatar</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Alt Text / Description
              </label>
              <input
                type="text"
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
                placeholder="Accessible image description..."
                className="w-full rounded-xl border border-slate-200/80 bg-slate-50/50 px-3 py-2 text-xs text-slate-900 focus:border-violet-500 focus:bg-white focus:outline-hidden dark:border-slate-800 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          {/* Footer CTA */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
            <button
              type="button"
              onClick={onClose}
              disabled={isUploading}
              className="rounded-xl border border-slate-200/80 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 transition-all"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={!selectedFile || isUploading}
              className="inline-flex items-center gap-1.5 rounded-xl bg-violet-600 px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-violet-700 active:bg-violet-800 disabled:opacity-50 transition-all"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Uploading to CDN...</span>
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  <span>Upload Asset</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
