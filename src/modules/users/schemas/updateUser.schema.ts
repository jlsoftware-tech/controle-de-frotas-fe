import * as z from 'zod';

export const updateUserSchema = z
  .object({
    name: z
      .string()
      .min(3, { message: 'O nome deve ter pelo menos 3 caracteres' })
      .optional(),
    email: z.email({ message: 'E-mail inválido' }).optional(),
    password: z
      .string()
      .min(8, { message: 'A senha deve ter pelo menos 8 caracteres' })
      .optional()
      .or(z.literal('')),
    confirmPassword: z.string().optional().or(z.literal('')),
    profile_id: z
      .string()
      .min(1, { message: 'Selecione um perfil de acesso' })
      .optional(),
    secretariat_id: z
      .string()
      .min(1, { message: 'Selecione uma secretaria' })
      .optional(),
  })
  .refine(
    (data) => {
      if (data.password && data.password !== '')
        return data.password === data.confirmPassword;
      return true;
    },
    {
      message: 'As senhas não coincidem',
      path: ['confirmPassword'],
    }
  );

export type UpdateUserFormValues = z.infer<typeof updateUserSchema>;
