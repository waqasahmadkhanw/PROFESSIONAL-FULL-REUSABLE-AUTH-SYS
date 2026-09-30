"use client";
import { getApiErrorMessage } from "@/shared/api/errorMessage";

import { useState } from "react";
import { Button } from "@/shared/components/ui";
import { Modal } from "@/shared/components/overlay/Modal";
import { useToast } from "@/shared/components/ui/Toast/useToast";
import { useNotifications } from "../hooks";
import { useRolesQuery } from "@/modules/roles/queries";
import type { NotificationRole, NotificationType } from "../types";

interface NotificationSendModalProps {
  open: boolean;
  onClose: () => void;
}

const TYPE_OPTIONS: NotificationType[] = ["system", "announcement", "payment", "message"];



/**
 * Admin "send notification" modal.
 *
 * Supports broadcasts to all users, to a role, or to a single user.
 */
export function NotificationSendModal({
  open,
  onClose,
}: NotificationSendModalProps) {
  const { send, isMutating } = useNotifications();
  const { data: rolesData } = useRolesQuery({ page: 1, limit: 100 });
  const toast = useToast();

  const [fieldMode, setFieldMode] = useState<"all" | "role" | "user">("all");
  const [targetRole, setTargetRole] = useState<NotificationRole>("user");
  const [userId, setUserId] = useState("");
  const [type, setType] = useState<NotificationType>("system");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [link, setLink] = useState("");
  const [error, setError] = useState("");

  const inputClass =
    "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500";
  const labelClass = "mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300";

  const reset = () => {
    setFieldMode("all");
    setTargetRole("user");
    setUserId("");
    setType("system");
    setTitle("");
    setMessage("");
    setLink("");
    setError("");
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = async () => {
    setError("");
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    if (fieldMode === "user" && !userId.trim()) {
      setError("User ID is required for a single-user notification.");
      return;
    }

    const payload = {
      type,
      title: title.trim(),
      message: message.trim() || undefined,
      link: link.trim() || undefined,
      ...(fieldMode === "role" ? { role: targetRole } : {}),
      ...(fieldMode === "user" ? { userId: userId.trim() } : {}),
    };

    try {
      const result = await send(payload);
      const count =
        typeof result === "object" && result && "count" in result
          ? result.count
          : 1;
      toast.success(`Notification sent to ${count} recipient(s)`);
      handleClose();
    } catch (err) {
      const message = getApiErrorMessage(err, "Failed to send notification.");
      setError(message);
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={handleClose}
      title="Send Notification"
    >
      <div className="space-y-4">
        <div>
          <label className={labelClass}>Recipients</label>
          <div className="grid grid-cols-3 gap-2">
            {(
              [
                { key: "all", label: "All users" },
                { key: "role", label: "By role" },
                { key: "user", label: "Single user" },
              ] as const
            ).map((opt) => (
              <button
                key={opt.key}
                type="button"
                onClick={() => setFieldMode(opt.key)}
                className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                  fieldMode === opt.key
                    ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                    : "border-slate-300 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {fieldMode === "role" && (
          <div>
            <label className={labelClass}>Target Role</label>
            <select
              className={inputClass}
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value as NotificationRole)}
            >
              {(rolesData?.roles ?? []).map((role) => (
                <option key={role._id} value={role.slug}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {fieldMode === "user" && (
          <div>
            <label className={labelClass}>User ID</label>
            <input
              className={inputClass}
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="User ObjectId"
            />
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Type</label>
            <select
              className={inputClass}
              value={type}
              onChange={(e) => setType(e.target.value as NotificationType)}
            >
              {TYPE_OPTIONS.map((t) => (
                <option key={t} value={t}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className={labelClass}>Title</label>
          <input
            className={inputClass}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Notification title"
          />
        </div>

        <div>
          <label className={labelClass}>Message</label>
          <textarea
            className={`${inputClass} resize-none`}
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Optional message"
          />
        </div>

        <div>
          <label className={labelClass}>Link</label>
          <input
            className={inputClass}
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="Optional deep link"
          />
        </div>

        {error && (
          <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </p>
        )}
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={isMutating}>
          {isMutating ? "Sending..." : "Send Notification"}
        </Button>
      </div>
    </Modal>
  );
}
