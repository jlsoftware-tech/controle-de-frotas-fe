import type { User } from '@/modules/users/types/user';

export type LoginResponse = {
  user: User; 
  token: string;
};

export interface LoginPayload {
  email: string;
  password?: string;
  remember?: boolean;
}
