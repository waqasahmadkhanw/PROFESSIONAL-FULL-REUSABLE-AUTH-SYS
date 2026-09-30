"use client";

import { useState } from "react";
import { useMyPaymentsQuery } from "../queries/useMyPaymentQueries";
import { Pagination } from "@/shared/components/navigation/Pagination";

export function MyPaymentsPage() {
  const [page, setPage] = useState(1);
  const query = useMyPaymentsQuery({ page, limit: 10 });

  return (
    <main className="mx-auto max-w-6xl space-y-6 px-4 py-8">
      <header>
        <h1 className="text-2xl font-bold">My Payments</h1>
        <p className="mt-1 text-sm text-slate-500">
          Review payments associated with your account.
        </p>
      </header>

      <section className="overflow-x-auto rounded-2xl border bg-white dark:border-slate-800 dark:bg-slate-900">
        {query.isLoading ? (
          <p className="p-8 text-sm text-slate-500">Loading payments…</p>
        ) : query.isError ? (
          <p className="p-8 text-sm text-red-600">
            {query.error instanceof Error ? query.error.message : "Unable to load payments."}
          </p>
        ) : (
          <>
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 dark:bg-white/5">
                <tr>
                  <th className="p-3 text-left">Payment</th>
                  <th className="p-3 text-left">Order</th>
                  <th className="p-3 text-left">Method</th>
                  <th className="p-3 text-left">Amount</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {query.data?.payments.map((payment) => {
                  const order =
                    typeof payment.order === "string" ? payment.order : payment.order?.orderNumber;

                  return (
                    <tr key={payment._id} className="border-t dark:border-slate-800">
                      <td className="p-3 font-mono text-xs">{payment._id}</td>
                      <td className="p-3">{order ?? "—"}</td>
                      <td className="p-3 capitalize">{payment.paymentMethod}</td>
                      <td className="p-3">{payment.amount.toFixed(2)} {payment.currency}</td>
                      <td className="p-3 capitalize">{payment.status}</td>
                      <td className="p-3">{new Date(payment.createdAt).toLocaleString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {!query.data?.payments.length && (
              <p className="p-8 text-center text-sm text-slate-500">No payments found.</p>
            )}

            {query.data?.pagination.pages > 1 && (
              <div className="flex justify-end border-t p-4 dark:border-slate-800">
                <Pagination
                  page={page}
                  totalPages={query.data.pagination.pages}
                  onPageChange={setPage}
                />
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}

export default MyPaymentsPage;
