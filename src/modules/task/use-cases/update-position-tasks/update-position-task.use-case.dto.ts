import { ApiProperty, PickType } from '@nestjs/swagger';
import { Task } from '@shared/domain/task';
import { ProjectTasks } from '@src/shared/domain/project-task';

export class UpdatePositionTaskUseCaseRequestDTO {
  @ApiProperty({ type: String })
  projectId: Task['id'];

  @ApiProperty({
    type: PickType(ProjectTasks, ['taskId', 'position']),
    isArray: true,
  })
  tasks: Pick<ProjectTasks, 'position' | 'taskId'>[];
}
