'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/constants/queryKeys';
import { clearAuditLogsApi, deleteAuditLogApi } from './api';
export const useDeleteAuditLogMutation=()=>{const qc=useQueryClient();return useMutation({mutationFn:(id:string)=>deleteAuditLogApi(id),onSuccess:()=>qc.invalidateQueries({queryKey:QUERY_KEYS.AUDIT_LOGS.ALL})});};
export const useClearAuditLogsMutation=()=>{const qc=useQueryClient();return useMutation({mutationFn:clearAuditLogsApi,onSuccess:()=>qc.invalidateQueries({queryKey:QUERY_KEYS.AUDIT_LOGS.ALL})});};
