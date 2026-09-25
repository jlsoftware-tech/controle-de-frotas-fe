export interface Permission {
  id: number;
  name: string;
  module: string;
  created_at?: string;
  updated_at?: string;
}

export type GetPermissionsParams = {
  page?: number;
  per_page?: number;
  search?: string;
};

export type PermissionsPagination = {
  numPerPage: number;
  currPage: number;
  totalEntries: number;
  totalPages: number;
};

export type PermissionsListing = {
  items: Permission[];
  pagination: PermissionsPagination;
};

export interface Profile {
  id: number;
  name: string;
  description: string | null;
  permissions?: Permission[];
  created_at: string;
  updated_at: string;
}

export type GetProfilesParams = {
  page?: number;
  per_page?: number;
  search?: string;
  sort?: 'name' | 'description' | 'created_at';
  order?: 'asc' | 'desc';
};

export type CreateProfilePayload = {
  name: string;
  description?: string;
  permissions: number[];
};

export type UpdateProfilePayload = Partial<CreateProfilePayload>;

export type ProfilesPagination = {
  numPerPage: number;
  currPage: number;
  totalEntries: number;
  totalPages: number;
};

export type ProfilesListing = {
  items: Profile[];
  pagination: ProfilesPagination;
};
