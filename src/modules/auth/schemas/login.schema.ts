import * as z from 'zod';

export const loginSchema = z.object({
  email: z.email('Formato de e-mail inválido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
