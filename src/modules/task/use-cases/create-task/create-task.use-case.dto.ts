import { ApiProperty, OmitType, PickType } from '@nestjs/swagger';
import { Task } from '@shared/domain/task';

export class CreateTaskUseCaseRequestDTO extends OmitType(Task, [
  'startDate',
  'createdAt',
  'updatedAt',
  'id',
  'Status',
]) {
  @ApiProperty({ type: String })
  projectId: Task['id'];
}
export class CreateTaskUseCaseResponseDTO extends PickType(Task, ['id']) {}
