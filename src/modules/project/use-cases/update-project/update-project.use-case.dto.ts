import { OmitType } from '@nestjs/swagger';
import { Project } from '@shared/domain/project';

export class UpdateProjectUseCaseRequestDTO extends OmitType(Project, [
  'startDate',
  'createdAt',
  'updatedAt',
  'id',
]) {
  id: string;
}
