export interface Secretariat {
  id: number;
  name: string;
  acronym: string;
  created_at?: string;
  updated_at?: string;
}

export type GetSecretariatsParams = {
  page?: number;
  per_page?: number;
  search?: string;
  sort?: 'name' | 'acronym' | 'created_at';
  order?: 'asc' | 'desc';
};

export type SecretariatsPagination = {
  numPerPage: number;
  currPage: number;
  totalEntries: number;
  totalPages: number;
};

export type SecretariatsListing = {
  items: Secretariat[];
  pagination: SecretariatsPagination;
};

export type CreateSecretariatPayload = {
  name: string;
  acronym: string;
};

export type UpdateSecretariatPayload = Partial<CreateSecretariatPayload>;
