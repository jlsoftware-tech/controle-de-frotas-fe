import type { PaginationParams, SortParams } from '@/shared/types/responseApi';

export interface Permission {
  id: number;
  name: string;
  module: string;
  created_at?: string;
  updated_at?: string;
}

export type GetPermissionsParams = PaginationParams;

export interface Profile {
  id: number;
  name: string;
  description: string | null;
  permissions?: Permission[];
  created_at: string;
  updated_at: string;
}

export type GetProfilesParams = PaginationParams & SortParams<'name' | 'description' | 'created_at'>;

export type CreateProfilePayload = {
  name: string;
  description?: string;
  permissions: number[];
};

export type UpdateProfilePayload = Partial<CreateProfilePayload>;
