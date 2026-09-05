import type { User } from '@/modules/users/types/user';

export type LoginResponse = User;

export interface LoginPayload {
  email: string;
  password?: string;
}
