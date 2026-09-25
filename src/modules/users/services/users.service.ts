import { deleteRequest, getRequest, postRequest, putRequest } from '@/shared/utils/axiosRequest';
import type {
  CreateUserPayload,
  GetUsersParams,
  UpdateUserPayload,
  User,
} from '../types/user';
import type { PaginatedResponse } from '@/shared/types/responseApi';

export function getUsers(params: GetUsersParams) {
  const query = new URLSearchParams({
    page: params.page.toString(),
    per_page: params.per_page.toString(),
  });
  if (params.search) query.append('search', params.search);
  if (params.sort) query.append('sort', params.sort);
  if (params.order) query.append('order', params.order);
  return getRequest<PaginatedResponse<User>>(`users?${query.toString()}`);
}

export function createUser(data: CreateUserPayload) {
  return postRequest<User>('users', data);
}

export function updateUser(id: number, data: UpdateUserPayload) {
  return putRequest<User>(`users/${id}`, data);
}

export function deleteUser(id: number) {
  return deleteRequest(`users/${id}`);
}
