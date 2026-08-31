import * as z from 'zod';

export const updateUserSchema = z.object({
  name: z.string().min(3, { message: 'O nome deve ter pelo menos 3 caracteres' }).optional(),
  email: z.email({ message: 'E-mail inválido' }).optional(),
  password: z.string().min(6, { message: 'A senha deve ter pelo menos 6 caracteres' }).optional().or(z.literal('')),
  confirmPassword: z.string().optional().or(z.literal('')),
  role: z.enum(['ADMIN', 'USER'], { message: 'Selecione um nível de acesso' }).optional(),
}).refine((data) => {
  if (data.password && data.password !== '') return data.password === data.confirmPassword;
  return true;
}, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
});

export type UpdateUserFormValues = z.infer<typeof updateUserSchema>;
