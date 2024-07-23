import { z } from 'zod';

export const DeleteTaskUseCaseRequestDTOSchema = z.object({
  id: z.string().min(1, 'Id required'),
});
