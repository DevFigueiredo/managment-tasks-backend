import { faker } from '@faker-js/faker';
import { ProjectFactory } from './project.factory';
import { ProjectTasks } from '@shared/domain/task';

export const ProjectTasksFactory = (
  projectTasks?: Partial<ProjectTasks>,
): ProjectTasks => {
  return {
    Project: ProjectFactory(),
    position: faker.number.int(),
    projectId: faker.string.uuid(),
    taskId: faker.string.uuid(),
    ...projectTasks,
  };
};
