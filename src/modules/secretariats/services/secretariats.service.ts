import { deleteRequest, getRequest, postRequest, putRequest } from '@/shared/utils/axiosRequest';
import type {
  CreateSecretariatPayload,
  GetSecretariatsParams,
  Secretariat,
  SecretariatsListing,
  UpdateSecretariatPayload,
} from '../types/secretariat';

export function getSecretariats(params: GetSecretariatsParams) {
  const query = new URLSearchParams({
    page: params.page.toString(),
    per_page: params.per_page.toString(),
  });
  if (params.search) query.append('search', params.search);
  if (params.sort) query.append('sort', params.sort);
  if (params.order) query.append('order', params.order);
  return getRequest<SecretariatsListing>(`secretariats?${query.toString()}`);
}

export function createSecretariat(data: CreateSecretariatPayload) {
  return postRequest<Secretariat>('secretariats', data);
}

export function updateSecretariat(id: number, data: UpdateSecretariatPayload) {
  return putRequest<Secretariat>(`secretariats/${id}`, data);
}

export function deleteSecretariat(id: number) {
  return deleteRequest(`secretariats/${id}`);
}
