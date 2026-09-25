import { deleteRequest, getRequest, postRequest, putRequest } from '@/shared/utils/axiosRequest';
import type { CreateProfilePayload, GetProfilesParams, Profile, ProfilesListing, UpdateProfilePayload } from '../types/profile';

export function getProfiles(params?: GetProfilesParams) {
  const query = new URLSearchParams();
  if (params?.page) query.append('page', params.page.toString());
  if (params?.per_page) query.append('per_page', params.per_page.toString());
  if (params?.search) query.append('search', params.search);
  if (params?.sort) query.append('sort', params.sort);
  if (params?.order) query.append('order', params.order);

  const qs = query.toString();
  return getRequest<ProfilesListing>(`profiles${qs ? `?${qs}` : ''}`);
}

export function createProfile(data: CreateProfilePayload) {
  return postRequest<Profile>('profiles', data);
}

export function updateProfile(id: number, data: UpdateProfilePayload) {
  return putRequest<Profile>(`profiles/${id}`, data);
}

export function deleteProfile(id: number) {
  return deleteRequest(`profiles/${id}`);
}
