import type { PaginationParams, SortParams } from '@/shared/types/responseApi';

export type User = {
  id: number;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
} & {
  profile: {
    id: number;
    name: string;
  } | null;
  secretariat: {
    id: number;
    name: string;
    acronym: string;
  } | null;
};

export type CreateUserPayload = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  profile_id: number;
  secretariat_id: number;
};

export type UpdateUserPayload = Partial<CreateUserPayload>;

export type GetUsersParams = Required<Pick<PaginationParams, 'page' | 'per_page'>> &
  PaginationParams &
  SortParams<'name' | 'email' | 'profile_id' | 'created_at'>;
