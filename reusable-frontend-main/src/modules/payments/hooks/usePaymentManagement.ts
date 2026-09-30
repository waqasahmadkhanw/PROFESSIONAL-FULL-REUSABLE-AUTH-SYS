"use client";

import { useCallback, useEffect, useState } from "react";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { usePayments } from "./usePayments";
import type { Payment } from "../types";

const PAGE_SIZE = 10;

export function usePaymentManagement() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [methodFilter, setMethodFilter] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const debouncedSearch = useDebounce(searchQuery.trim(), 400);

  const query = usePayments({
    page,
    limit: PAGE_SIZE,
    search: debouncedSearch || undefined,
    status: statusFilter || undefined,
    paymentMethod: methodFilter || undefined,
  });

  useEffect(() => {
    setPage(1);
    setSelectedIds([]);
  }, [debouncedSearch, statusFilter, methodFilter]);

  const payments = query.data?.payments ?? [];

  const handleToggleSelect = useCallback((id: string) => {
    setSelectedIds((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id]
    );
  }, []);

  const handleToggleSelectAll = useCallback(() => {
    setSelectedIds((previous) =>
      previous.length === payments.length ? [] : payments.map((payment) => payment._id)
    );
  }, [payments]);

  const clearFilters = useCallback(() => {
    setSearchQuery("");
    setStatusFilter("");
    setMethodFilter("");
  }, []);

  return {
    page,
    setPage,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    methodFilter,
    setMethodFilter,
    selectedIds,
    selectedPayment,
    setSelectedPayment,
    payments,
    clearFilters,
    handleToggleSelect,
    handleToggleSelectAll,
    ...query,
  };
}
