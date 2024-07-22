import { z } from 'zod';

export const UpdateTaskUseCaseRequestDTOSchema = z.object({
  id: z.string().min(1, 'ID is required'), // Assuming ID is a UUID
  statusId: z.string().optional(), // Assuming Status ID is a UUID
  text: z.string().optional(),
  title: z.string().optional(),
  endDate: z
    .string()
    .or(z.date())
    .refine((val) => !isNaN(new Date(val).getTime()), 'Invalid end date')
    .optional(),
});
