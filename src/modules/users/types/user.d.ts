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
  };
  secretariat: {
    id: number;
    name: string;
    acronym: string;
  };
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

export type GetUsersParams = {
  page: number;
  per_page: number;
  search?: string;
  sort?: 'name' | 'email' | 'profile_id' | 'created_at';
  order?: 'asc' | 'desc';
};

export type UsersPagination = {
  numPerPage: number;
  currPage: number;
  totalEntries: number;
  totalPages: number;
};

export type UsersListing = {
  items: User[];
  pagination: UsersPagination;
};
