"use client";

import { CreditCard } from "lucide-react";
import { Loading, ErrorState, EmptyState } from "@/shared/components/feedback";
import { Pagination } from "@/shared/components/navigation/Pagination";
import { downloadCsv, type CsvValue } from "@/shared/utils/csv";
import { usePaymentManagement } from "../hooks";
import {
  PaymentsHeader,
  PaymentKpiCards,
  PaymentAnalyticsCard,
  PaymentsTable,
  PaymentDetailModal,
} from "../components";
import type { Payment } from "../types";

function paymentToCsvRow(payment: Payment): CsvValue[] {
  const customer = typeof payment.customer === "object" && payment.customer ? payment.customer : null;
  return [
    payment._id,
    customer?.name ?? "N/A",
    customer?.email ?? "N/A",
    payment.items?.[0]?.itemName ?? "N/A",
    payment.amount,
    payment.currency,
    payment.paymentMethod,
    payment.status,
    payment.paidAt ?? payment.createdAt,
  ];
}

export function PaymentsPage() {
  const state = usePaymentManagement();

  const handleExportCsv = () => {
    if (!state.payments.length) return;

    downloadCsv(`payments_${new Date().toISOString().slice(0, 10)}.csv`, [
      ["Payment ID", "Customer Name", "Customer Email", "Item", "Amount", "Currency", "Method", "Status", "Paid Date"],
      ...state.payments.map(paymentToCsvRow),
    ]);
  };

  return (
    <div className="space-y-6 pb-12">
      <PaymentsHeader
        searchQuery={state.searchQuery}
        setSearchQuery={state.setSearchQuery}
        statusFilter={state.statusFilter}
        setStatusFilter={state.setStatusFilter}
        methodFilter={state.methodFilter}
        setMethodFilter={state.setMethodFilter}
        isRefetching={Boolean(state.isRefetching)}
        onRefresh={() => state.refetch()}
        onExport={handleExportCsv}
      />

      <PaymentKpiCards payments={state.payments} isLoading={state.isLoading} />
      <PaymentAnalyticsCard payments={state.payments} isLoading={state.isLoading} />

      <div className="space-y-4">
        {state.isLoading ? (
          <Loading message="Loading payment transactions..." />
        ) : state.isError ? (
          <ErrorState
            title="Failed to load payments"
            message={state.error?.message ?? "The payments service is unavailable right now."}
            onRetry={() => state.refetch()}
          />
        ) : state.payments.length > 0 ? (
          <>
            <PaymentsTable
              payments={state.payments}
              onView={state.setSelectedPayment}
              selectedIds={state.selectedIds}
              onToggleSelect={state.handleToggleSelect}
              onToggleSelectAll={state.handleToggleSelectAll}
            />

            {state.data && state.data.pagination.pages > 1 && (
              <div className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white p-4 text-xs shadow-2xs dark:border-slate-800/80 dark:bg-slate-900">
                <span className="font-medium text-slate-500 dark:text-slate-400">
                  Showing Page {state.data.pagination.page} of {state.data.pagination.pages} ({state.data.pagination.total} Total Payments)
                </span>
                <Pagination
                  page={state.page}
                  totalPages={state.data.pagination.pages}
                  onPageChange={state.setPage}
                />
              </div>
            )}
          </>
        ) : (
          <div className="rounded-2xl border border-slate-200/80 bg-white p-12 text-center shadow-2xs dark:border-slate-800/80 dark:bg-slate-900">
            <EmptyState
              icon={<CreditCard className="h-10 w-10 text-slate-300 dark:text-slate-700" />}
              title="No payments found"
              description="No transaction records match your active search or filters."
            />
          </div>
        )}
      </div>

      <PaymentDetailModal
        payment={state.selectedPayment}
        onClose={() => state.setSelectedPayment(null)}
      />
    </div>
  );
}

export default PaymentsPage;
