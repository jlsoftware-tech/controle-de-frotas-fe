import type { User } from "@/modules/users/types/user";

export interface LoginResponse {
  user: User;
  token: string;
}

export interface LoginPayload {
  email: string;
  password?: string;
}
