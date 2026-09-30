"use client";
import {useQuery} from "@tanstack/react-query"; import {couponApi} from "../api"; import {QUERY_KEYS} from "@/shared/constants/queryKeys"; import type {CouponQueryParams} from "../types"; export const useCouponsQuery=(params?:CouponQueryParams)=>useQuery({queryKey:QUERY_KEYS.COUPONS.LIST(params as Record<string, unknown>),queryFn:()=>couponApi.getAll(params)}); export const useCouponQuery=(id?:string)=>useQuery({queryKey:QUERY_KEYS.COUPONS.DETAILS(id??""),queryFn:()=>couponApi.getById(id!),enabled:Boolean(id)});




