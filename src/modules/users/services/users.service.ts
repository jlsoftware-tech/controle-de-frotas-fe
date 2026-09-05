import { deleteRequest, getRequest, postRequest, putRequest } from '@/shared/utils/axiosRequest';
import type { CreateUserPayload, CreateUserResponse, GetUsersParams, UpdateUserPayload, UsersResponse } from '../types/user';

export function getUsers(params: GetUsersParams) {
  const query = new URLSearchParams({ page: params.page.toString(), limit: params.limit.toString() });
  if (params.search) query.append('search', params.search);
  if (params.role && params.role !== 'ALL') query.append('role', params.role);
  return getRequest<UsersResponse>(`/users?${query.toString()}`);
}

export function createUser(data: CreateUserPayload) {
  return postRequest<CreateUserResponse>('/users', data);
}

export function updateUser(id: string, data: UpdateUserPayload) {
  return putRequest<CreateUserResponse>(`/users/${id}`, data);
}

export function deleteUser(id: string) {
  return deleteRequest(`/users/${id}`);
}
