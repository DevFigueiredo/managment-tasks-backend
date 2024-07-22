import { ApiProperty } from '@nestjs/swagger';
import { Project } from '@prisma/client';
import { Task } from '@shared/domain/task';

export class GetTaskUseCaseRequestDTO {
  @ApiProperty()
  projectId: Project['id'];
}
export class GetTaskUseCaseResponseDTO extends Task {}
