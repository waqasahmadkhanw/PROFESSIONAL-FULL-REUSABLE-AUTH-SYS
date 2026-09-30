"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/shared/components/ui/Button";
import { Modal } from "@/shared/components/overlay/Modal";
import { useToast } from "@/shared/components/ui/Toast/useToast";
import { useCouponsQuery } from "../queries";
import { useCurrentUserQuery } from "@/modules/auth";
import { hasPermission } from "@/modules/auth/utils/auth.permission";
import { PERMISSIONS } from "@/shared/constants/permissions";
import { useCreateCouponMutation, useDeleteCouponMutation } from "../mutations";
import { couponSchema, type CouponFormValues } from "../validation";
import type { CouponDiscountType } from "../types";

export function CouponsPage() {
  const [open, setOpen] = useState(false);
  const toast = useToast();
  const query = useCouponsQuery();
  const { data: currentUser } = useCurrentUserQuery();
  const canManage = hasPermission(currentUser, PERMISSIONS.MANAGE_COUPONS);
  const create = useCreateCouponMutation();
  const remove = useDeleteCouponMutation();

  const form = useForm<CouponFormValues>({
    defaultValues: {
      code: "",
      discountType: "percentage",
      discountValue: 0,
      expiryDate: "",
    },
  });

  const submit = form.handleSubmit(async (values) => {
    const parsed = couponSchema.safeParse(values);
    if (!parsed.success) {
      parsed.error.issues.forEach((issue) => {
        const path = issue.path[0] as keyof CouponFormValues;
        form.setError(path, { type: "validation", message: issue.message });
      });
      return;
    }

    try {
      await create.mutateAsync({
        code: parsed.data.code.trim().toUpperCase(),
        discountType: parsed.data.discountType,
        discountValue: parsed.data.discountValue,
        expiryDate: new Date(`${parsed.data.expiryDate}T23:59:59.999Z`).toISOString(),
      });
      form.reset();
      setOpen(false);
      toast.success("Coupon created successfully.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create coupon.");
    }
  });

  const handleDelete = async (id: string) => {
    try {
      await remove.mutateAsync(id);
      toast.success("Coupon deleted successfully.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete coupon.");
    }
  };

  const fieldError = (name: keyof CouponFormValues) => form.formState.errors[name]?.message;

  return (
    <main className="space-y-6 p-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Coupons</h1>
          <p className="text-sm text-slate-500">Reusable promotion and discount management.</p>
        </div>
        {canManage && <Button onClick={() => setOpen(true)}>New coupon</Button>}
      </div>

      <div className="overflow-x-auto rounded-2xl border bg-white dark:border-slate-800 dark:bg-slate-900">
        {query.isLoading ? (
          <div className="p-8 text-sm text-slate-500">Loading coupons…</div>
        ) : query.isError ? (
          <div className="p-8 text-sm text-red-600">Failed to load coupons.</div>
        ) : (
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 dark:bg-white/5">
              <tr>
                <th className="p-3 text-left">Code</th>
                <th className="p-3 text-left">Discount</th>
                <th className="p-3 text-left">Usage</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {query.data?.coupons.map((coupon) => (
                <tr key={coupon._id} className="border-t dark:border-slate-800">
                  <td className="p-3 font-semibold">{coupon.code}</td>
                  <td className="p-3">
                    {coupon.discountType === "percentage"
                      ? `${coupon.discountValue}%`
                      : coupon.discountValue}
                  </td>
                  <td className="p-3">{coupon.usedCount}/{coupon.maxUses || "∞"}</td>
                  <td className="p-3 text-right">
                    {canManage && (
                      <Button
                        size="sm"
                        variant="danger"
                        loading={remove.isPending && remove.variables === coupon._id}
                        disabled={remove.isPending}
                        onClick={() => void handleDelete(coupon._id)}
                      >
                        Delete
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
              {!query.data?.coupons.length && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-500">No coupons found.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      <Modal
        open={canManage && open}
        onOpenChange={(value) => {
          setOpen(value);
          if (!value) form.reset();
        }}
        title="Create coupon"
      >
        <form className="space-y-4" onSubmit={submit} noValidate>
          <label className="block space-y-1 text-sm">
            <span className="font-medium">Code</span>
            <input
              className="w-full rounded-lg border p-3 uppercase dark:bg-slate-950"
              placeholder="SAVE20"
              {...form.register("code")}
            />
            {fieldError("code") && <span className="text-xs text-red-600">{fieldError("code")}</span>}
          </label>

          <label className="block space-y-1 text-sm">
            <span className="font-medium">Discount type</span>
            <select
              className="w-full rounded-lg border p-3 dark:bg-slate-950"
              {...form.register("discountType")}
              onChange={(event) => form.setValue("discountType", event.target.value as CouponDiscountType)}
            >
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed amount</option>
            </select>
            {fieldError("discountType") && <span className="text-xs text-red-600">{fieldError("discountType")}</span>}
          </label>

          <label className="block space-y-1 text-sm">
            <span className="font-medium">Discount value</span>
            <input
              type="number"
              min="0.01"
              step="0.01"
              className="w-full rounded-lg border p-3 dark:bg-slate-950"
              {...form.register("discountValue", { valueAsNumber: true })}
            />
            {fieldError("discountValue") && <span className="text-xs text-red-600">{fieldError("discountValue")}</span>}
          </label>

          <label className="block space-y-1 text-sm">
            <span className="font-medium">Expiry date</span>
            <input type="date" className="w-full rounded-lg border p-3 dark:bg-slate-950" {...form.register("expiryDate")} />
            {fieldError("expiryDate") && <span className="text-xs text-red-600">{fieldError("expiryDate")}</span>}
          </label>

          <Button type="submit" loading={create.isPending} className="w-full">
            Create coupon
          </Button>
        </form>
      </Modal>
    </main>
  );
}

export default CouponsPage;
