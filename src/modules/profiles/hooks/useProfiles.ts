import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import {
  createProfile,
  deleteProfile,
  getProfiles,
  updateProfile,
} from '../services/profiles.service';
import type {
  GetProfilesParams,
  Profile,
  UpdateProfilePayload,
} from '../types/profile';
import { USER_PERMISSIONS_QUERY_KEY } from '@/shared/hooks/useUserPermissions';
import type { PaginatedResponse } from '@/shared/types/responseApi';

const emptyListing: PaginatedResponse<Profile> = {
  items: [],
  pagination: { numPerPage: 10, currPage: 1, totalEntries: 0, totalPages: 0 },
};

const fetchProfiles = async (params?: GetProfilesParams): Promise<PaginatedResponse<Profile>> => {
  const response = await getProfiles(params);
  if (response.success && response.data) return response.data;
  if (!response.success) toast.error(response.message);
  return emptyListing;
};

export function useProfiles(params?: GetProfilesParams, options?: { enabled?: boolean }) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: [
      'profiles',
      params?.page || '',
      params?.per_page || '',
      params?.search || '',
      params?.sort || '',
      params?.order || '',
    ],
    queryFn: () => fetchProfiles(params),
    placeholderData: (previousData) => previousData,
    enabled: options?.enabled ?? true,
  });

  const createMutation = useMutation({
    mutationFn: createProfile,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['profiles'] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateProfilePayload }) => updateProfile(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
      queryClient.invalidateQueries({ queryKey: [USER_PERMISSIONS_QUERY_KEY] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
      queryClient.invalidateQueries({ queryKey: [USER_PERMISSIONS_QUERY_KEY] });
    },
  });

  return {
    ...query,
    createMutation,
    updateMutation,
    deleteMutation,
  };
}
