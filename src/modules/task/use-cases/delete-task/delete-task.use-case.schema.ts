import { z } from 'zod';

export const DeleteTaskUseCaseRequestDTOSchema = z.object({
  id: z.string().uuid('Invalid ID format'), // Assuming ID is a UUID
});
