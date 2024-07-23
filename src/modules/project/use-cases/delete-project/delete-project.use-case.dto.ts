import { PickType } from '@nestjs/swagger';
import { Project } from '@shared/domain/project';

export class DeleteProjectUseCaseRequestDTO extends PickType(Project, ['id']) {}
