'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/constants/queryKeys';
import { useAppDispatch } from '@/shared/store';
import { logout } from '@/modules/auth/store';
import { clearCsrfToken } from '@/shared/api';
import { emitLocalAuthSync, publishAuthSync } from '@/modules/auth/utils/auth.sync';
import { AUTH_QUERY_KEYS } from '@/modules/auth/constants/auth.query-keys';
import { profileApi } from '../api';
import type { UpdateProfilePayload, UpdateSocialLinksPayload } from '../types';
const invalidate = (qc: ReturnType<typeof useQueryClient>) => { qc.invalidateQueries({ queryKey: QUERY_KEYS.PROFILE.CURRENT }); qc.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.CURRENT_USER }); };
export const useUpdateProfileMutation = () => { const qc=useQueryClient(); return useMutation({ mutationFn:(data:UpdateProfilePayload)=>profileApi.update(data), onSuccess:()=>invalidate(qc) }); };
export const useUpdateSocialLinksMutation = () => { const qc=useQueryClient(); return useMutation({ mutationFn:(data:UpdateSocialLinksPayload)=>profileApi.updateSocials(data), onSuccess:()=>invalidate(qc) }); };
export const useUploadProfileAvatarMutation = () => { const qc=useQueryClient(); return useMutation({ mutationFn:(file:File)=>profileApi.uploadAvatar(file), onSuccess:()=>invalidate(qc) }); };
export const useDeleteProfileAvatarMutation = () => { const qc=useQueryClient(); return useMutation({ mutationFn:profileApi.deleteAvatar, onSuccess:()=>invalidate(qc) }); };
export const useDeleteAccountMutation = () => {
  const qc = useQueryClient();
  const dispatch = useAppDispatch();
  return useMutation({
    mutationFn: profileApi.deleteAccount,
    onSuccess: () => {
      clearCsrfToken();
      qc.clear();
      dispatch(logout());
      emitLocalAuthSync("logout");
      publishAuthSync("logout");
    },
  });
};
