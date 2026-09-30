"use client";

import React from "react";
import Link from "next/link";
import {
  Search,
  RotateCcw,
  Upload,
  ChevronRight,
  Home,
  X,
  SlidersHorizontal,
  LayoutGrid,
  List,
  Filter,
  Calendar,
  FolderOpen,
} from "lucide-react";

interface MediaFilterBarProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  mediaTypeFilter: string;
  setMediaTypeFilter: (val: string) => void;
  usageFilter: string;
  setUsageFilter: (val: string) => void;
  dateFilter: string;
  setDateFilter: (val: string) => void;
  sortBy: string;
  setSortBy: (val: string) => void;
  viewMode: "grid" | "list";
  setViewMode: (val: "grid" | "list") => void;
  isRefetching?: boolean;
  onRefresh: () => void;
  onOpenUpload: () => void;
  onReset: () => void;
  hasActiveFilters: boolean;
}

export function MediaFilterBar({
  searchQuery,
  setSearchQuery,
  mediaTypeFilter,
  setMediaTypeFilter,
  usageFilter,
  setUsageFilter,
  dateFilter,
  setDateFilter,
  sortBy,
  setSortBy,
  viewMode,
  setViewMode,
  isRefetching,
  onRefresh,
  onOpenUpload,
  onReset,
  hasActiveFilters,
}: MediaFilterBarProps) {
  return (
    <div className="space-y-4">
      {/* 1. Header Navigation & Main Upload CTA */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          {/* Breadcrumb */}
          <nav className="mb-1 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <Link
              href="/admin"
              className="flex items-center gap-1 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
            >
              <Home className="h-3.5 w-3.5" />
              <span>Dashboard</span>
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
            <span className="font-semibold text-slate-900 dark:text-white">Media Library</span>
          </nav>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Media Library
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Manage uploaded images, videos, documents, and assets used across the application.
          </p>
        </div>

        {/* Global Toolbar Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onRefresh}
            disabled={isRefetching}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200/80 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 hover:text-slate-900 dark:border-slate-800/80 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white transition-all disabled:opacity-60"
            title="Refresh Media Assets"
          >
            <RotateCcw className={`h-3.5 w-3.5 ${isRefetching ? "animate-spin text-violet-600" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            onClick={onOpenUpload}
            className="inline-flex items-center gap-1.5 rounded-xl bg-violet-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-violet-700 active:bg-violet-800 transition-all dark:bg-violet-600 dark:hover:bg-violet-500"
          >
            <Upload className="h-4 w-4" />
            <span>Upload Asset</span>
          </button>
        </div>
      </div>

      {/* 2. Filter Toolbar */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-2xs dark:border-slate-800/80 dark:bg-slate-900">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search assets by filename or alt text..."
              className="w-full rounded-xl border border-slate-200/80 bg-slate-50/50 pl-10 pr-9 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-violet-500 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-violet-500/20 dark:border-slate-800/80 dark:bg-slate-800/40 dark:text-white dark:placeholder-slate-500 dark:focus:border-violet-400 dark:focus:bg-slate-900 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Dropdown Filters & Layout Controls Group */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Media Type Filter */}
            <div className="relative">
              <select
                value={mediaTypeFilter}
                onChange={(e) => setMediaTypeFilter(e.target.value)}
                className="h-9 appearance-none rounded-xl border border-slate-200/80 bg-slate-50/50 pl-3 pr-8 text-xs font-semibold text-slate-700 focus:border-violet-500 focus:outline-hidden dark:border-slate-800/80 dark:bg-slate-800/40 dark:text-slate-200"
              >
                <option value="">All Asset Types</option>
                <option value="image">Images</option>
                <option value="video">Videos</option>
                <option value="document">Documents</option>
                <option value="audio">Audio</option>
                <option value="other">Other Assets</option>
              </select>
              <Filter className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            </div>

            {/* Usage Context Filter */}
            <div className="relative">
              <select
                value={usageFilter}
                onChange={(e) => setUsageFilter(e.target.value)}
                className="h-9 appearance-none rounded-xl border border-slate-200/80 bg-slate-50/50 pl-3 pr-8 text-xs font-semibold text-slate-700 focus:border-violet-500 focus:outline-hidden dark:border-slate-800/80 dark:bg-slate-800/40 dark:text-slate-200"
              >
                <option value="">All Usages</option>
                <option value="avatar">User Avatars</option>
                <option value="general">General Media</option>
              </select>
              <FolderOpen className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            </div>

            {/* Date Filter */}
            <div className="relative">
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="h-9 appearance-none rounded-xl border border-slate-200/80 bg-slate-50/50 pl-3 pr-8 text-xs font-semibold text-slate-700 focus:border-violet-500 focus:outline-hidden dark:border-slate-800/80 dark:bg-slate-800/40 dark:text-slate-200"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
              </select>
              <Calendar className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="h-9 appearance-none rounded-xl border border-slate-200/80 bg-slate-50/50 pl-3 pr-8 text-xs font-semibold text-slate-700 focus:border-violet-500 focus:outline-hidden dark:border-slate-800/80 dark:bg-slate-800/40 dark:text-slate-200"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="name_asc">Name (A-Z)</option>
                <option value="name_desc">Name (Z-A)</option>
                <option value="size_desc">Size (Largest)</option>
                <option value="size_asc">Size (Smallest)</option>
              </select>
              <SlidersHorizontal className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center rounded-xl border border-slate-200/80 bg-slate-50/50 p-1 dark:border-slate-800/80 dark:bg-slate-800/40">
              <button
                onClick={() => setViewMode("grid")}
                className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs transition-all ${
                  viewMode === "grid"
                    ? "bg-white text-violet-600 shadow-2xs dark:bg-slate-900 dark:text-violet-400 font-bold"
                    : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                }`}
                title="Grid View"
              >
                <LayoutGrid className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs transition-all ${
                  viewMode === "list"
                    ? "bg-white text-violet-600 shadow-2xs dark:bg-slate-900 dark:text-violet-400 font-bold"
                    : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                }`}
                title="List View"
              >
                <List className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Reset Filters */}
            {hasActiveFilters && (
              <button
                onClick={onReset}
                className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50/60 px-3 text-xs font-semibold text-rose-700 hover:bg-rose-100 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300 transition-all"
              >
                <X className="h-3.5 w-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
