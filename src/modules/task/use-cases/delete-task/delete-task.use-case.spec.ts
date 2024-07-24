import { Test, TestingModule } from '@nestjs/testing';
import { DeleteTaskUseCase } from '../delete-task/delete-task.use-case';
import { TaskRepository } from '../../infra/database/repositories/task.repository';
import { ITaskRepository } from '../../infra/database/repositories/interfaces/task.repository-interface';
import { MockProxy, mock } from 'jest-mock-extended';
import { DeleteTaskUseCaseRequestDTO } from '../delete-task/delete-task.use-case.dto';
import { TaskFactory } from '@test/factories/task.factory';
import { NotFoundException } from '@nestjs/common';

describe('DeleteTaskUseCase', () => {
  let sut: DeleteTaskUseCase;
  const taskRepository: MockProxy<ITaskRepository.Repository> = mock();

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteTaskUseCase,
        { provide: TaskRepository, useValue: taskRepository },
      ],
    }).compile();

    sut = module.get<DeleteTaskUseCase>(DeleteTaskUseCase);
  });

  describe('execute', () => {
    it('should throw NotFoundException if task does not exist', async () => {
      const requestDTO: DeleteTaskUseCaseRequestDTO = { id: 'non_existing_id' };

      jest.spyOn(taskRepository, 'getOne').mockResolvedValueOnce(null);

      await expect(sut.execute(requestDTO)).rejects.toThrow(
        new NotFoundException(`Task with ID ${requestDTO.id} not found`),
      );
      expect(taskRepository.getOne).toHaveBeenCalledWith({ id: requestDTO.id });
      expect(taskRepository.removeTaskFromProject).not.toHaveBeenCalled();
      expect(taskRepository.delete).not.toHaveBeenCalled();
    });

    it('should remove task from project and delete the task', async () => {
      const requestDTO: DeleteTaskUseCaseRequestDTO = { id: 'existing_id' };
      const existingTask = TaskFactory({ id: requestDTO.id });

      jest.spyOn(taskRepository, 'getOne').mockResolvedValueOnce(existingTask);
      jest
        .spyOn(taskRepository, 'removeTaskFromProject')
        .mockResolvedValueOnce();
      jest.spyOn(taskRepository, 'delete').mockResolvedValueOnce(null);

      await sut.execute(requestDTO);

      expect(taskRepository.getOne).toHaveBeenCalledWith({ id: requestDTO.id });
      expect(taskRepository.removeTaskFromProject).toHaveBeenCalledWith(
        requestDTO.id,
      );
      expect(taskRepository.delete).toHaveBeenCalledWith({ id: requestDTO.id });
    });
  });
});
