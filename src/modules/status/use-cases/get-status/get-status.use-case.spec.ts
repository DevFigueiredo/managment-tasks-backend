import { Test, TestingModule } from '@nestjs/testing';
import { GetStatusUseCase } from './get-status.use-case';
import { StatusRepository } from '../../infra/database/repositories/status.repository';
import { IStatusRepository } from '../../infra/database/repositories/interfaces/status.repository-interface';
import { MockProxy, mock } from 'jest-mock-extended';
import {
  GetStatusUseCaseRequestDTO,
  GetStatusUseCaseResponseDTO,
} from './get-status.use-case.dto';
import { StatusFactory } from '@test/factories/status.factory';

describe('GetStatusUseCase', () => {
  let sut: GetStatusUseCase;
  const statusRepository: MockProxy<IStatusRepository.Repository> = mock();

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetStatusUseCase,
        { provide: StatusRepository, useValue: statusRepository },
      ],
    }).compile();

    sut = module.get<GetStatusUseCase>(GetStatusUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  describe('execute', () => {
    it('should return a list of statuses for a given project ID', async () => {
      const params: GetStatusUseCaseRequestDTO = {
        projectId: 'existing_project_id',
      };

      const statusStub: GetStatusUseCaseResponseDTO[] = [
        StatusFactory(),
        StatusFactory(),
      ];

      jest.spyOn(statusRepository, 'get').mockResolvedValueOnce(statusStub);

      const result = await sut.execute(params);

      expect(statusRepository.get).toHaveBeenCalledWith({
        projectId: params.projectId,
      });
      expect(result).toEqual(statusStub);
    });

    it('should return an empty list if no statuses are found for a given project ID', async () => {
      const params: GetStatusUseCaseRequestDTO = {
        projectId: 'existing_project_id',
      };

      jest.spyOn(statusRepository, 'get').mockResolvedValueOnce([]);

      const result = await sut.execute(params);

      expect(statusRepository.get).toHaveBeenCalledWith({
        projectId: params.projectId,
      });
      expect(result).toEqual([]);
    });
  });
});
