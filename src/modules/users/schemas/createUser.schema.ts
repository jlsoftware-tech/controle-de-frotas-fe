import * as z from 'zod';

export const createUserSchema = z
  .object({
    name: z
      .string()
      .min(3, { message: 'O nome deve ter pelo menos 3 caracteres' }),
    email: z.email({ message: 'E-mail inválido' }),
    password: z
      .string()
      .min(8, { message: 'A senha deve ter pelo menos 8 caracteres' }),
    confirmPassword: z
      .string()
      .min(8, { message: 'A confirmação deve ter pelo menos 8 caracteres' }),
    profile_id: z
      .string()
      .min(1, { message: 'Selecione um perfil de acesso' }),
    secretariat_id: z
      .string()
      .min(1, { message: 'Selecione uma secretaria' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  });

export type CreateUserFormValues = z.infer<typeof createUserSchema>;
