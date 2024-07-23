import { z } from 'zod';

export const CreateProjectUseCaseRequestDTOSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  endDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), 'Invalid end date'),
  startDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), 'Invalid end date')
    .optional(),
});
