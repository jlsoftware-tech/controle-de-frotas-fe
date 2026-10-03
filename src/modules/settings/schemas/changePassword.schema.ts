import * as z from 'zod';

export const changePasswordSchema = z
  .object({
    password: z.string().min(8, { message: 'A senha deve ter pelo menos 8 caracteres' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  });

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
