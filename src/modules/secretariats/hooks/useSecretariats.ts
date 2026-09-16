import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createSecretariat,
  deleteSecretariat,
  getSecretariats,
  updateSecretariat,
} from '../services/secretariats.service';
import type {
  GetSecretariatsParams,
  Secretariat,
  UpdateSecretariatPayload,
} from '../types/secretariat';

const fetchSecretariats = async (
  params?: GetSecretariatsParams
): Promise<Secretariat[]> => {
  const response = await getSecretariats(params);
  if (response.success && response.data) return response.data;
  return [];
};

export function useSecretariats(params?: GetSecretariatsParams) {
  const queryClient = useQueryClient();

  // Mesmo padrão do useProfiles: normaliza os parâmetros ausentes/vazios
  // pra mesma chave, assim quem só quer a lista completa (ex: select do
  // UserFormModal) reaproveita o cache de quem já buscou "sem filtro" na
  // SecretariatsList, em vez de disparar uma segunda requisição idêntica.
  const query = useQuery({
    queryKey: [
      'secretariats',
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
