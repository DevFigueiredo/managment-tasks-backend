import { Test, TestingModule } from '@nestjs/testing';
import { StatusRepository } from './status.repository';
import { Status } from '@shared/domain/status';
import { StatusFactory } from '@test/factories/status.factory';
import { mockDeep, mockReset } from 'jest-mock-extended';
import { PrismaClient } from '@prisma/client';

describe('StatusRepository', () => {
  let repository: StatusRepository;
  const prisma = mockDeep<PrismaClient>() as any;

  beforeEach(async () => {
    mockReset(prisma);
    const module: TestingModule = await Test.createTestingModule({
      providers: [StatusRepository, { provide: 'db', useValue: prisma }],
    }).compile();

    repository = module.get<StatusRepository>(StatusRepository);
  });

  describe('getOne', () => {
    it('should return a single status for the given id', async () => {
      const statusId = 'test_status_id';
      const status = StatusFactory();

      jest
        .spyOn(prisma.status, 'findFirst')
        .mockResolvedValueOnce(status as any);

      const result = await repository.getOne({ id: statusId });

      expect(prisma.status.findFirst).toHaveBeenCalledWith({
        where: { id: statusId },
      });
      expect(result).toEqual(status);
    });
  });

  describe('get', () => {
    it('should return a list of statuses for the given projectId', async () => {
      const projectId = 'test_project_id';
      const statuses: Status[] = [StatusFactory(), StatusFactory()];

      jest
        .spyOn(prisma.status, 'findMany')
        .mockResolvedValueOnce(statuses as any);

      const result = await repository.get({ projectId });

      expect(prisma.status.findMany).toHaveBeenCalledWith({
        where: {
          projectId,
        },
      });
      expect(result).toEqual(statuses);
    });
  });
});
