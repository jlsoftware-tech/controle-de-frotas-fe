import type { CreateUserFormValues } from '../schemas/createUser.schema';

export interface User {
  id: string;
  name: string;
  email: string;
  profile_id: number;
  createdAt: string;
  updatedAt: string;
}

export type CreateUserPayload = Omit<CreateUserFormValues, 'confirmPassword'>;

export interface CreateUserResponse {
  user: User;
}

export type UpdateUserPayload = Partial<CreateUserPayload>;

export type GetUsersParams = {
  page: number;
  limit: number;
  search?: string;
  role?: string;
};

export type UsersResponse = {
  data: User[];
  total: number;
  totalPages: number;
};
