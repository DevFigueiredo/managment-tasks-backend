import { ApiProperty } from '@nestjs/swagger';
import { Project } from '@shared/domain/project';

export class GetProjectUseCaseRequestDTO {}
export class GetProjectUseCaseResponseDTO extends Project {
  @ApiProperty()
  completionPercentage: number;
  @ApiProperty()
  isDelayed: boolean;
}
