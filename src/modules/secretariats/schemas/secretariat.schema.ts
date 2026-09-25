import * as z from 'zod';

export const secretariatSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'O nome deve ter pelo menos 3 caracteres' })
    .max(255, { message: 'O nome deve ter no máximo 255 caracteres' }),
  acronym: z
    .string()
    .min(2, { message: 'A sigla deve ter pelo menos 2 caracteres' })
    .max(16, { message: 'A sigla deve ter no máximo 16 caracteres' }),
});

export type SecretariatFormValues = z.infer<typeof secretariatSchema>;
