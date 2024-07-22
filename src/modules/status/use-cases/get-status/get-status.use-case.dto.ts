import { ApiProperty } from '@nestjs/swagger';
import { Project } from '@prisma/client';
import { Status } from '@shared/domain/status';

export class GetStatusUseCaseRequestDTO {
  @ApiProperty({ required: false })
  projectId?: Project['id'];
}
export class GetStatusUseCaseResponseDTO extends Status {}
