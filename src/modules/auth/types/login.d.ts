import type { User } from './user';

export interface LoginResponse {
  user: User;
  token: string;
}

export interface LoginPayload {
  email: string;
  password?: string;
}
