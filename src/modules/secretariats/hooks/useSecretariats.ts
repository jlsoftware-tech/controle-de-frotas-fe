import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createSecretariat,
  deleteSecretariat,
  getSecretariats,
  updateSecretariat,
} from '../services/secretariats.service';
import type {
  GetSecretariatsParams,
  SecretariatsListing,
  UpdateSecretariatPayload,
} from '../types/secretariat';

const emptyListing: SecretariatsListing = {
  items: [],
  pagination: { numPerPage: 10, currPage: 1, totalEntries: 0, totalPages: 0 },
};

const fetchSecretariats = async (
  params?: GetSecretariatsParams
): Promise<SecretariatsListing> => {
  const response = await getSecretariats(params);
  if (response.success && response.data) return response.data;
  return emptyListing;
};

export function useSecretariats(params?: GetSecretariatsParams) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: [
      'secretariats',
      params?.page || '',
      params?.per_page || '',
      params?.search || '',
      params?.sort || '',
      params?.order || '',
    ],
    queryFn: () => fetchSecretariats(params),
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 30,
  });

  const createMutation = useMutation({
    mutationFn: createSecretariat,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['secretariats'] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateSecretariatPayload }) =>
      updateSecretariat(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['secretariats'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSecretariat,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['secretariats'] }),
  });

  return {
    ...query,
    createMutation,
    updateMutation,
    deleteMutation,
  };
}
