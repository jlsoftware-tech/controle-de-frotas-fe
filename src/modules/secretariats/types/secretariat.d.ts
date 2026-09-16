export interface Secretariat {
  id: number;
  name: string;
  acronym: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

export type GetSecretariatsParams = {
  search?: string;
  sort?: 'name' | 'acronym' | 'created_at';
  order?: 'asc' | 'desc';
};

export type CreateSecretariatPayload = {
  name: string;
  acronym: string;
};

export type UpdateSecretariatPayload = Partial<CreateSecretariatPayload>;
