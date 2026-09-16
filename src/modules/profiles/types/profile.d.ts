export interface Permission {
  id: number;
  name: string;
  module: string;
  created_at?: string;
  updated_at?: string;
}

export interface Profile {
  id: number;
  name: string;
  description: string | null;
  permissions?: Permission[];
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export type GetProfilesParams = {
  search?: string;
  sort?: 'name' | 'description' | 'created_at';
  order?: 'asc' | 'desc';
  per_page?: number;
};

export type CreateProfilePayload = {
  name: string;
  description?: string;
  permissions: number[];
};

export type UpdateProfilePayload = Partial<CreateProfilePayload>;
