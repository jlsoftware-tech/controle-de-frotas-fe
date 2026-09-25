import type { PaginationParams, SortParams } from '@/shared/types/responseApi';

export interface Secretariat {
  id: number;
  name: string;
  acronym: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

export type GetSecretariatsParams = PaginationParams & SortParams<'name' | 'acronym' | 'created_at'>;

export type CreateSecretariatPayload = {
  name: string;
  acronym: string;
};

export type UpdateSecretariatPayload = Partial<CreateSecretariatPayload>;
