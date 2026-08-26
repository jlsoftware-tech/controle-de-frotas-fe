import * as z from 'zod';

export const createUserSchema = z.object({
  name: z.string().min(3, { message: 'O nome deve ter pelo menos 3 caracteres' }),
  email: z.email({ message: 'E-mail inválido' }),
  password: z.string().min(6, { message: 'A senha deve ter pelo menos 6 caracteres' }),
  confirmPassword: z.string().min(6, { message: 'A confirmação deve ter pelo menos 6 caracteres' }),
  role: z.enum(['ADMIN', 'USER'], { message: 'Selecione um nível de acesso' }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
});

export type CreateUserFormValues = z.infer<typeof createUserSchema>;
