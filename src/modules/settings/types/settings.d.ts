export type UpdateInfoPayload = {
  name?: string;
  email?: string;
};

export type ChangePasswordPayload = {
  password: string;
  password_confirmation: string;
};
