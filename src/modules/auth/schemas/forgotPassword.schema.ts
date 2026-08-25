import * as z from 'zod';

export const requestResetSchema = z.object({
  email: z.email('Formato de e-mail inválido'),
});

export type RequestResetFormValues = z.infer<typeof requestResetSchema>;

