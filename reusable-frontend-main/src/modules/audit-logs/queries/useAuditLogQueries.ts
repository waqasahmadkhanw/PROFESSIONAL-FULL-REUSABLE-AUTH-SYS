'use client';
import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/constants/queryKeys';
import { getAuditLogByIdApi,getAuditLogStatsApi,getAuditLogsApi } from '../api';
export const useAuditLogsQuery=(page:number,limit:number)=>useQuery({queryKey:QUERY_KEYS.AUDIT_LOGS.LIST({page,limit}),queryFn:()=>getAuditLogsApi({page,limit})});
export const useAuditLogQuery=(id?:string)=>useQuery({queryKey:QUERY_KEYS.AUDIT_LOGS.DETAILS(id??''),queryFn:()=>getAuditLogByIdApi(id!),enabled:Boolean(id)});
export const useAuditLogStatsQuery=()=>useQuery({queryKey:QUERY_KEYS.AUDIT_LOGS.STATS,queryFn:getAuditLogStatsApi});
