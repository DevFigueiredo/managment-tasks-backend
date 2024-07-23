import { z } from 'zod';

export const UpdateTaskUseCaseRequestDTOSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  statusId: z.string().optional(),
  text: z.string().optional(),
  title: z.string().optional(),
  endDate: z
    .string()
    .or(z.date())
    .refine((val) => !isNaN(new Date(val).getTime()), 'Invalid end date')
    .optional(),
});
