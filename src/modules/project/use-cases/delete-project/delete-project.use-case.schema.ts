import { z } from 'zod';

export const DeleteProjectUseCaseRequestDTOSchema = z.object({
  id: z.string().min(1, 'Id required'),
});
