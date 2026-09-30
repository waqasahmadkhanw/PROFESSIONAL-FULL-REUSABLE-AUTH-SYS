"use client";
import {useQuery} from "@tanstack/react-query"; import {orderApi} from "../api"; import {QUERY_KEYS} from "@/shared/constants/queryKeys"; import type {OrderQueryParams} from "../types"; export const useOrdersQuery=(params?:OrderQueryParams)=>useQuery({queryKey:QUERY_KEYS.ORDERS.LIST(params as Record<string, unknown>),queryFn:()=>orderApi.getAll(params)}); export const useMyOrdersQuery=(params?:OrderQueryParams)=>useQuery({queryKey:QUERY_KEYS.ORDERS.ME,queryFn:()=>orderApi.getMine(params)}); export const useOrderQuery=(id?:string)=>useQuery({queryKey:QUERY_KEYS.ORDERS.DETAILS(id??""),queryFn:()=>orderApi.getById(id!),enabled:Boolean(id)});




