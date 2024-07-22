import { OmitType } from '@nestjs/swagger';
import { Project } from '@prisma/client';
import { Task } from '@shared/domain/task';

export class UpdateTaskUseCaseRequestDTO extends OmitType(Task, [
  'startDate',
  'createdAt',
  'updatedAt',
  'id',
  'Status',
]) {
  id: Task['id'];
  projectId: Project['id'];
}
