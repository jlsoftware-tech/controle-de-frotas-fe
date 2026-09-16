import { deleteRequest, getRequest, postRequest, putRequest } from '@/shared/utils/axiosRequest';
import type {
  CreateSecretariatPayload,
  GetSecretariatsParams,
  Secretariat,
  UpdateSecretariatPayload,
} from '../types/secretariat';

export function getSecretariats(params?: GetSecretariatsParams) {
  const query = new URLSearchParams();
  if (params?.search) query.append('search', params.search);
  if (params?.sort) query.append('sort', params.sort);
  if (params?.order) query.append('order', params.order);

  const qs = query.toString();
  return getRequest<Secretariat[]>(`/secretariats${qs ? `?${qs}` : ''}`);
}

export function createSecretariat(data: CreateSecretariatPayload) {
  return postRequest<Secretariat>('/secretariats', data);
}

export function updateSecretariat(id: number, data: UpdateSecretariatPayload) {
  return putRequest<Secretariat>(`/secretariats/${id}`, data);
}

export function deleteSecretariat(id: number) {
  return deleteRequest(`/secretariats/${id}`);
}
