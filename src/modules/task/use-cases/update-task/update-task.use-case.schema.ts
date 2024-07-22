import { z } from 'zod';

export const UpdateTaskUseCaseRequestDTOSchema = z.object({
  id: z.string().uuid('Invalid ID format'), // Assuming ID is a UUID
  statusId: z.string().uuid('Invalid Status ID format'), // Assuming Status ID is a UUID
  text: z.string().min(1, 'Text is required'),
  title: z.string().min(1, 'Title is required'),
  endDate: z
    .string()
    .or(z.date())
    .refine((val) => !isNaN(new Date(val).getTime()), 'Invalid end date'),
});
