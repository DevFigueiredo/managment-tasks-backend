import { z } from 'zod';

export const UpdatePositionTaskUseCaseRequestDTOSchema = z.object({
  projectId: z.string().min(1, 'ProjectId is required'),
  tasks: z.array(
    z.object({
      taskId: z.string().min(1, 'TaskId is required'),
      position: z.number(),
    }),
  ),
});
