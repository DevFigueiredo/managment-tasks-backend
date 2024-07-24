import { Test, TestingModule } from '@nestjs/testing';
import { TaskRepository } from '@src/modules/task/infra/database/repositories/task.repository';
import { ITaskRepository } from '../../infra/database/repositories/interfaces/task.repository-interface';
import { MockProxy, mock } from 'jest-mock-extended';
import { TaskFactory } from '@test/factories/task.factory';
import { GetTaskUseCase } from '../get-tasks/get-task.use-case';

describe('GetTaskUseCase', () => {
  let sut: GetTaskUseCase;
  const taskRepository: MockProxy<ITaskRepository.Repository> = mock();

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetTaskUseCase,
        { provide: TaskRepository, useValue: taskRepository },
      ],
    }).compile();

    sut = module.get<GetTaskUseCase>(GetTaskUseCase);
  });

  describe('execute', () => {
    it('should return tasks for the given projectId', async () => {
      const requestDTO = { projectId: 'any_project_id' };

      const tasks = [
        TaskFactory({ id: 'test_task_id_1' }),
        TaskFactory({ id: 'test_task_id_2' }),
      ];

      jest.spyOn(taskRepository, 'get').mockResolvedValueOnce(tasks);

      const result = await sut.execute(requestDTO);

      expect(taskRepository.get).toHaveBeenCalledWith({
        projectId: requestDTO.projectId,
      });
      expect(result).toEqual(tasks);
    });
  });
});
