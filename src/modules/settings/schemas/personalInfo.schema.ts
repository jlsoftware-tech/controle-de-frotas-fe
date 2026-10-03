import * as z from 'zod';

export const personalInfoSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, { message: 'O nome deve ter pelo menos 3 caracteres' })
    .max(255, { message: 'O nome deve ter no máximo 255 caracteres' }),
  email: z
    .email({ message: 'E-mail inválido' })
    .max(255, { message: 'O e-mail deve ter no máximo 255 caracteres' }),
});

export type PersonalInfoFormValues = z.infer<typeof personalInfoSchema>;
