import { OmitType, PickType } from '@nestjs/swagger';
import { Project } from '@shared/domain/project';

export class CreateProjectUseCaseRequestDTO extends OmitType(Project, [
  'startDate',
  'createdAt',
  'updatedAt',
  'id',
]) {}
export class CreateProjectUseCaseResponseDTO extends PickType(Project, [
  'id',
]) {}
