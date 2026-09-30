"use client";

import { useState } from "react";
import { Plus, RefreshCw, Settings as SettingsIcon } from "lucide-react";
import { Button } from "@/shared/components/ui";
import { Card, CardContent, CardFooter } from "@/shared/components/ui/Card";
import {
  Loading,
  ErrorState,
  EmptyState,
} from "@/shared/components/feedback";
import { Pagination } from "@/shared/components/navigation/Pagination";
import { PageHeader } from "@/shared/components/navigation/PageHeader";
import { useToast } from "@/shared/components/ui/Toast/useToast";
import { useSettings } from "../hooks";
import { SettingsTable } from "../components/SettingsTable";
import { SettingFormModal } from "../components/SettingFormModal";
import { SettingDeleteDialog } from "../components/SettingDeleteDialog";
import { SETTING_MESSAGES } from "../constants";
import type { Setting } from "../types";

const PAGE_SIZE = 10;

/**
 * Settings management page (admin).
 *
 * Lists paginated settings from `/api/settings` and allows
 * creating, editing, and deleting system configuration values.
 */
export function SettingsPage() {
  const [page, setPage] = useState(1);
  const [editingSetting, setEditingSetting] = useState<Setting | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [deletingSetting, setDeletingSetting] = useState<Setting | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const toast = useToast();

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    createSetting,
    updateSetting,
    deleteSetting,
    isCreating,
    isUpdating,
    isDeleting,
  } = useSettings({ page, limit: PAGE_SIZE });

  const handleCreate = () => {
    setEditingSetting(null);
    setFormOpen(true);
  };

  const handleEdit = (setting: Setting) => {
    setEditingSetting(setting);
    setFormOpen(true);
  };

  const handleSubmit = async (payload: {
    id?: string;
    data: Parameters<typeof createSetting>[0] | Parameters<typeof updateSetting>[1];
  }) => {
    try {
      if (payload.id) {
        await updateSetting(payload.id, payload.data as Parameters<typeof updateSetting>[1]);
        toast.success(SETTING_MESSAGES.UPDATE_SUCCESS);
      } else {
        await createSetting(payload.data as Parameters<typeof createSetting>[0]);
        toast.success(SETTING_MESSAGES.CREATE_SUCCESS);
      }
      setFormOpen(false);
      setEditingSetting(null);
    } catch (err) {
      toast.error(
        payload.id ? SETTING_MESSAGES.UPDATE_ERROR : SETTING_MESSAGES.CREATE_ERROR
      );
    }
  };

  const handleDelete = async () => {
    if (!deletingSetting) return;
    try {
      await deleteSetting(deletingSetting._id);
      toast.success(SETTING_MESSAGES.DELETE_SUCCESS);
      setDeleteOpen(false);
      setDeletingSetting(null);
    } catch {
      toast.error(SETTING_MESSAGES.DELETE_ERROR);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage platform configuration, appearance, and system values."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              leftIcon={<RefreshCw className="h-4 w-4" />}
              onClick={() => refetch()}
            >
              Refresh
            </Button>
            <Button
              leftIcon={<Plus className="h-4 w-4" />}
              onClick={handleCreate}
            >
              Add Setting
            </Button>
          </div>
        }
      />

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <Loading message="Loading settings..." />
          ) : isError ? (
            <ErrorState
              title="Failed to load settings"
              message={error?.message ?? "Please try again later."}
              onRetry={() => refetch()}
            />
          ) : data && data.settings.length > 0 ? (
            <SettingsTable
              settings={data.settings}
              onEdit={handleEdit}
              onDelete={(s) => {
                setDeletingSetting(s);
                setDeleteOpen(true);
              }}
            />
          ) : (
            <EmptyState
              icon={<SettingsIcon className="h-8 w-8 text-slate-300" />}
              title="No settings found"
              description="System configuration values will appear here."
            />
          )}
        </CardContent>

        {data && data.pagination.pages > 1 && (
          <CardFooter>
            <Pagination
              page={page}
              totalPages={data.pagination.pages}
              onPageChange={setPage}
            />
          </CardFooter>
        )}
      </Card>

      <SettingFormModal
        open={formOpen}
        setting={editingSetting}
        isSubmitting={isCreating || isUpdating}
        onClose={() => {
          setFormOpen(false);
          setEditingSetting(null);
        }}
        onSubmit={handleSubmit}
      />

      <SettingDeleteDialog
        open={deleteOpen}
        setting={deletingSetting}
        isDeleting={isDeleting}
        onClose={() => {
          setDeleteOpen(false);
          setDeletingSetting(null);
        }}
        onConfirm={handleDelete}
      />
    </div>
  );
}
