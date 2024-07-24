import { Test, TestingModule } from '@nestjs/testing';
import { MockProxy, mock } from 'jest-mock-extended';
import { StatusController } from './status.controller';
import { GetStatusUseCase } from '@src/modules/status/use-cases/get-status/get-status.use-case';
import { GetStatusUseCaseResponseDTO } from '@src/modules/status/use-cases/get-status/get-status.use-case.dto';
import { StatusFactory } from '@test/factories/status.factory';

describe('StatusController', () => {
  let sut: StatusController;
  const getStatusUseCase: MockProxy<GetStatusUseCase> = mock();

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StatusController],
      providers: [{ provide: GetStatusUseCase, useValue: getStatusUseCase }],
    }).compile();

    sut = module.get<StatusController>(StatusController);
  });

  describe('get', () => {
    it('should return a list of statuses for the given projectId', async () => {
      const projectId = '1';
      const statuses: GetStatusUseCaseResponseDTO[] = [
        StatusFactory(),
        StatusFactory(),
      ];
      jest.spyOn(getStatusUseCase, 'execute').mockResolvedValue(statuses);

      const result = await sut.get(projectId);

      expect(result).toEqual(statuses);
      expect(getStatusUseCase.execute).toHaveBeenCalledWith({ projectId });
      expect(getStatusUseCase.execute).toHaveBeenCalledTimes(1);
    });

    it('should return a list of statuses without filtering by projectId', async () => {
      const statuses: GetStatusUseCaseResponseDTO[] = [
        StatusFactory(),
        StatusFactory(),
      ];
      jest.spyOn(getStatusUseCase, 'execute').mockResolvedValue(statuses);

      const result = await sut.get();

      expect(result).toEqual(statuses);
      expect(getStatusUseCase.execute).toHaveBeenCalledWith({
        projectId: undefined,
      });
      expect(getStatusUseCase.execute).toHaveBeenCalledTimes(1);
    });
  });
});
