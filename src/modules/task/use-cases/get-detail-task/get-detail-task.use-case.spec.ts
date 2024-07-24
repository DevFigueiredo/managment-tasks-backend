import { Test, TestingModule } from '@nestjs/testing';
import { GetDetailTaskUseCase } from './get-detail-task.use-case';
import { TaskRepository } from '@src/modules/task/infra/database/repositories/task.repository';
import { ITaskRepository } from '../../infra/database/repositories/interfaces/task.repository-interface';
import { MockProxy, mock } from 'jest-mock-extended';
import { NotFoundException } from '@nestjs/common';
import { GetDetailTaskUseCaseResponseDTO } from './get-detail-task.use-case.dto';
import { TaskFactory } from '@test/factories/task.factory';

describe('GetDetailTaskUseCase', () => {
  let sut: GetDetailTaskUseCase;
  const taskRepository: MockProxy<ITaskRepository.Repository> = mock();

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetDetailTaskUseCase,
        { provide: TaskRepository, useValue: taskRepository },
      ],
    }).compile();

    sut = module.get<GetDetailTaskUseCase>(GetDetailTaskUseCase);
  });

  describe('execute', () => {
    it('should return task details for the given id', async () => {
      const requestDTO = { id: 'test_task_id' };
      const task: GetDetailTaskUseCaseResponseDTO = TaskFactory({
        id: requestDTO.id,
      });

      jest.spyOn(taskRepository, 'getOne').mockResolvedValueOnce(task);

      const result = await sut.execute(requestDTO);

      expect(taskRepository.getOne).toHaveBeenCalledWith({ id: requestDTO.id });
      expect(result).toEqual(task);
    });

    it('should throw an error if task is not found', async () => {
      const requestDTO = { id: 'test_task_id' };

      jest.spyOn(taskRepository, 'getOne').mockResolvedValueOnce(null);

      await expect(sut.execute(requestDTO)).rejects.toThrow(
        new NotFoundException('Task not found'),
      );
    });
  });
});
