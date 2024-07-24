import { faker } from '@faker-js/faker';
import { Project } from '@shared/domain/project';

export const ProjectFactory = (project?: Partial<Project>): Project => {
  return {
    id: faker.string.uuid(),
    name: faker.company.name(),
    description: faker.lorem.sentence(),
    startDate: faker.date.future(),
    endDate: faker.date.future(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
    ...project,
  };
};
