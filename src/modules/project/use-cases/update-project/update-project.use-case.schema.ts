import { z } from 'zod';

export const UpdateProjectUseCaseRequestDTOSchema = z.object({
  id: z.string().min(1, 'Id is required'),
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  endDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), 'Invalid end date'),
});
