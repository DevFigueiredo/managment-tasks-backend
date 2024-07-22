import { ApiProperty, PickType } from '@nestjs/swagger';
import { Project } from '@shared/domain/project';

export class GetDetailProjectUseCaseRequestDTO extends PickType(Project, [
  'id',
]) {}
export class GetDetailProjectUseCaseResponseDTO extends Project {
  @ApiProperty()
  completionPercentage: number;
  @ApiProperty()
  isDelayed: boolean;
}
