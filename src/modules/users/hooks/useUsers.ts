import type { GetUsersParams, UpdateUserPayload, User } from '@/modules/users/types/user';
import { USER_PERMISSIONS_QUERY_KEY } from '@/shared/hooks/useUserPermissions';
import type { PaginatedResponse } from '@/shared/types/responseApi';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createUser, deleteUser, getUsers, updateUser } from '../services/users.service';

const emptyListing: PaginatedResponse<User> = {
  items: [],
  pagination: { numPerPage: 10, currPage: 1, totalEntries: 0, totalPages: 0 },
};

const fetchUsers = async (params: GetUsersParams): Promise<PaginatedResponse<User>> => {
  const response = await getUsers(params);
  if (response.success && response.data) return response.data;
  return emptyListing;
};

export function useUsers(params?: GetUsersParams) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: [
      'users',
      params?.page,
      params?.per_page,
      params?.search,
      params?.sort,
      params?.order,
    ],
    queryFn: () => fetchUsers(params!),
    enabled: !!params,
    placeholderData: (previousData) => previousData,
  });

  const createMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateUserPayload }) => updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: [USER_PERMISSIONS_QUERY_KEY] });
    },
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
