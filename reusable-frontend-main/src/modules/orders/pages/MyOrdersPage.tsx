"use client";

import { useState } from "react";
import { useMyOrdersQuery } from "../queries";
import { useCancelOrderMutation } from "../mutations";
import { Button } from "@/shared/components/ui/Button";
import { Pagination } from "@/shared/components/navigation/Pagination";

export function MyOrdersPage() {
  const [page, setPage] = useState(1);
  const query = useMyOrdersQuery({ page, limit: 10 });
  const cancel = useCancelOrderMutation();

  return (
    <main className="mx-auto max-w-6xl space-y-6 px-4 py-8">
      <header>
        <h1 className="text-2xl font-bold">My Orders</h1>
        <p className="mt-1 text-sm text-slate-500">
          View your orders and cancel eligible pending orders.
        </p>
      </header>

      <section className="overflow-x-auto rounded-2xl border bg-white dark:border-slate-800 dark:bg-slate-900">
        {query.isLoading ? (
          <p className="p-8 text-sm text-slate-500">Loading orders…</p>
        ) : query.isError ? (
          <p className="p-8 text-sm text-red-600">
            {query.error instanceof Error ? query.error.message : "Unable to load orders."}
          </p>
        ) : (
          <>
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 dark:bg-white/5">
                <tr>
                  <th className="p-3 text-left">Order</th>
                  <th className="p-3 text-left">Total</th>
                  <th className="p-3 text-left">Payment</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {query.data?.orders.map((order) => {
                  const cancellable =
                    order.status === "pending" &&
                    ["pending", "failed"].includes(order.paymentStatus);

                  return (
                    <tr key={order._id} className="border-t dark:border-slate-800">
                      <td className="p-3 font-semibold">{order.orderNumber}</td>
                      <td className="p-3">{order.total.toFixed(2)} {order.currency}</td>
                      <td className="p-3">{order.paymentStatus}</td>
                      <td className="p-3">{order.status}</td>
                      <td className="p-3 text-right">
                        {cancellable && (
                          <Button
                            size="sm"
                            variant="danger"
                            loading={cancel.isPending && cancel.variables === order._id}
                            onClick={() => cancel.mutate(order._id)}
                          >
                            Cancel
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {!query.data?.orders.length && (
              <p className="p-8 text-center text-sm text-slate-500">No orders found.</p>
            )}

            {query.data?.pagination && query.data.pagination.pages > 1 && (
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

export default MyOrdersPage;
