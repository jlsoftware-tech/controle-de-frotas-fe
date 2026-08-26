import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UpdateUserPayload, UsersResponse, GetUsersParams } from '@/modules/users/types/user';
import { getUsers, createUser, updateUser, deleteUser } from '../services/users.service';

const fetchUsers = async (params: GetUsersParams): Promise<UsersResponse> => {
  const response = await getUsers(params);
  if (response.success && response.data) return response.data as UsersResponse;
  return { data: [], total: 0, totalPages: 0 };
};

export function useUsers(params?: GetUsersParams) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['users', params?.page, params?.limit, params?.search, params?.role],
    queryFn: () => fetchUsers(params!),
    enabled: !!params,
    placeholderData: (previousData) => previousData,
  });

  const createMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserPayload }) => updateUser(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });

  return {
    ...query,
    createMutation,
    updateMutation,
    deleteMutation,
  };
}
