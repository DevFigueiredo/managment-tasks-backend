import { ApiProperty, PickType } from '@nestjs/swagger';
import { ProjectTasks, Task } from '@shared/domain/task';

export class UpdatePositionTaskUseCaseRequestDTO {
  @ApiProperty({ type: String })
  projectId: Task['id'];

  @ApiProperty({
    type: PickType(ProjectTasks, ['taskId', 'position']),
    isArray: true,
  })
  tasks: Pick<ProjectTasks, 'position' | 'taskId'>[];
}
