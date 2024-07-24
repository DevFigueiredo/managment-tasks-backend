import { faker } from '@faker-js/faker';
import { Status } from '@shared/domain/status';
import { StatusTypeEnum } from '@shared/utils/enums/status.enum';

export const StatusFactory = (status?: Partial<Status>): Status => {
  const statusTypes = [
    StatusTypeEnum.pending,
    StatusTypeEnum.closed,
    StatusTypeEnum.inprogress,
  ];

  return {
    id: faker.string.uuid(),
    description: faker.lorem.sentence(),
    type: statusTypes[Math.floor(Math.random() * statusTypes.length)],
    color: faker.color.rgb(),
    default: faker.datatype.boolean(),
    projectId: faker.string.uuid(),
    ...status,
  };
};
