import * as z from 'zod';

export const profileSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'O nome deve ter pelo menos 3 caracteres' })
    .max(32, { message: 'O nome deve ter no máximo 32 caracteres' }),
  description: z
    .string()
    .max(255, { message: 'A descrição deve ter no máximo 255 caracteres' })
    .optional()
    .or(z.literal('')),
  permissions: z.array(z.number()).default([]),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
