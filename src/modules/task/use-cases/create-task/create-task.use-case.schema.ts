import { z } from 'zod';

export const CreateTaskUseCaseRequestDTOSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  projectId: z.string().min(1, 'ProjectId is required'),
  text: z.string().optional(),
  statusId: z.string(),
  endDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), 'Invalid end date')
    .optional(),
});
