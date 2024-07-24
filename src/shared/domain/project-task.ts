import { ApiProperty } from '@nestjs/swagger';
import { Project } from './project';
export class ProjectTasks {
  @ApiProperty()
  Project: Project;
  @ApiProperty()
  position: number;
  @ApiProperty()
  projectId: string;
  @ApiProperty()
  taskId: string;
}
