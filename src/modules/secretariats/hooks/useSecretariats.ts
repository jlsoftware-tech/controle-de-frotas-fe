import type { GetSecretariatsParams, Secretariat, UpdateSecretariatPayload } from '@/modules/secretariats/types/secretariat';
import type { PaginatedResponse } from '@/shared/types/responseApi';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { createSecretariat, deleteSecretariat, getSecretariats, updateSecretariat } from '../services/secretariats.service';

const emptyListing: PaginatedResponse<Secretariat> = {
  items: [],
  pagination: { numPerPage: 10, currPage: 1, totalEntries: 0, totalPages: 0 },
};

const fetchSecretariats = async (params: GetSecretariatsParams): Promise<PaginatedResponse<Secretariat>> => {
  const response = await getSecretariats(params);
  if (response.success && response.data) return response.data;
  if (!response.success) toast.error(response.message);
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
    queryFn: () => fetchSecretariats(params!),
    enabled: !!params,
    placeholderData: (previousData) => previousData,
  });

  const createMutation = useMutation({
    mutationFn: createSecretariat,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['secretariats'] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateSecretariatPayload }) => updateSecretariat(id, data),
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
