import { faker } from '@faker-js/faker';
import { Task } from '@shared/domain/task';
import { StatusFactory } from './status.factory';
import { ProjectTasksFactory } from './project-task.factory';

export const TaskFactory = (): Task => {
  return {
    id: faker.string.uuid(),
    text: faker.lorem.paragraph(),
    title: faker.lorem.sentence(),
    startDate: faker.date.future().toISOString(),
    endDate: faker.date.future().toISOString(),
    statusId: faker.string.uuid(),
    Status: StatusFactory(),
    ProjectTask: Array.from({ length: 3 }, ProjectTasksFactory),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
  };
};
