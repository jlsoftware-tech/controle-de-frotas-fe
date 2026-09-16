import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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

const fetchProfiles = async (params?: GetProfilesParams): Promise<Profile[]> => {
  const response = await getProfiles(params);
  if (response.success && response.data) return response.data;
  return [];
};

export function useProfiles(params?: GetProfilesParams) {
  const queryClient = useQueryClient();

  // Normaliza os parâmetros ausentes/vazios para a mesma chave: assim uma
  // tela que só precisa da lista completa (ex: select de outro formulário)
  // reaproveita o cache de quem já buscou "sem filtro", em vez de disparar
  // uma segunda requisição idêntica a /profiles.
  const query = useQuery({
    queryKey: [
      'profiles',
      params?.search || '',
      params?.sort || '',
      params?.order || '',
    ],
    queryFn: () => fetchProfiles(params),
    placeholderData: (previousData) => previousData,
  });

  const createMutation = useMutation({
    mutationFn: createProfile,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['profiles'] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateProfilePayload }) =>
      updateProfile(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['profiles'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProfile,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['profiles'] }),
  });

  return {
    ...query,
    createMutation,
    updateMutation,
    deleteMutation,
  };
}
