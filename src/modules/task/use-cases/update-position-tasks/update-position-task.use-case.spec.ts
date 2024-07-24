import { Test, TestingModule } from '@nestjs/testing';
import { UpdatePositionTaskUseCase } from './update-position-task.use-case';
import { TaskRepository } from '../../infra/database/repositories/task.repository';
import { ProjectRepository } from '@src/modules/project/infra/database/repositories/project.repository';
import { ITaskRepository } from '../../infra/database/repositories/interfaces/task.repository-interface';
import { IProjectRepository } from '@src/modules/project/infra/database/repositories/interfaces/project.repository-interface';
import { MockProxy, mock } from 'jest-mock-extended';
import { BadRequestException } from '@nestjs/common';
import { TaskFactory } from '@test/factories/task.factory';
import { ProjectFactory } from '@test/factories/project.factory';
import { UpdatePositionTaskUseCaseRequestDTO } from './update-position-task.use-case.dto';

export const createUpdatePositionTaskRequestDTO = (
  overrides: Partial<UpdatePositionTaskUseCaseRequestDTO> = {},
): UpdatePositionTaskUseCaseRequestDTO => ({
  projectId: 'test_project_id',
  tasks: [
    { taskId: 'test_task_id_1', position: 1 },
    { taskId: 'test_task_id_2', position: 2 },
    // Add more tasks if needed
  ],
  ...overrides,
});

describe('UpdatePositionTaskUseCase', () => {
  let sut: UpdatePositionTaskUseCase;
  const taskRepository: MockProxy<ITaskRepository.Repository> = mock();
  const projectRepository: MockProxy<IProjectRepository.Repository> = mock();

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdatePositionTaskUseCase,
        { provide: TaskRepository, useValue: taskRepository },
        { provide: ProjectRepository, useValue: projectRepository },
      ],
    }).compile();

    sut = module.get<UpdatePositionTaskUseCase>(UpdatePositionTaskUseCase);
  });

  describe('execute', () => {
    it('should update task positions with valid input data', async () => {
      const requestDTO = createUpdatePositionTaskRequestDTO();

      jest
        .spyOn(projectRepository, 'getOne')
        .mockResolvedValueOnce(ProjectFactory());
      jest
        .spyOn(taskRepository, 'get')
        .mockResolvedValueOnce([
          TaskFactory({ id: 'test_task_id_1' }),
          TaskFactory({ id: 'test_task_id_2' }),
        ]);
      jest
        .spyOn(taskRepository, 'updateTaskPositions')
        .mockResolvedValueOnce(undefined);

      await sut.execute(requestDTO);

      expect(projectRepository.getOne).toHaveBeenCalledWith({
        id: requestDTO.projectId,
      });
      expect(taskRepository.get).toHaveBeenCalledWith({
        projectId: requestDTO.projectId,
      });
      expect(taskRepository.updateTaskPositions).toHaveBeenCalledWith({
        projectId: requestDTO.projectId,
        tasks: requestDTO.tasks,
      });
    });

    it('should throw an error if project is not found', async () => {
      const requestDTO = createUpdatePositionTaskRequestDTO();

      jest.spyOn(projectRepository, 'getOne').mockResolvedValueOnce(null);

      await expect(sut.execute(requestDTO)).rejects.toThrow(
        new BadRequestException(
          `Project with ID ${requestDTO.projectId} not found`,
        ),
      );
    });

    it('should throw an error if task is not found', async () => {
      const requestDTO = createUpdatePositionTaskRequestDTO();

      jest
        .spyOn(projectRepository, 'getOne')
        .mockResolvedValueOnce(ProjectFactory());
      jest
        .spyOn(taskRepository, 'get')
        .mockResolvedValueOnce([TaskFactory({ id: 'test_task_id_1' })]);

      await expect(sut.execute(requestDTO)).rejects.toThrow(
        new BadRequestException('Task(s) not found: test_task_id_2'),
      );
    });

    it('should throw an error if duplicate positions are found', async () => {
      const requestDTO = createUpdatePositionTaskRequestDTO({
        tasks: [
          { taskId: 'test_task_id_1', position: 1 },
          { taskId: 'test_task_id_2', position: 1 }, // Duplicate position
        ],
      });

      jest
        .spyOn(projectRepository, 'getOne')
        .mockResolvedValueOnce(ProjectFactory());
      jest
        .spyOn(taskRepository, 'get')
        .mockResolvedValueOnce([
          TaskFactory({ id: 'test_task_id_1' }),
          TaskFactory({ id: 'test_task_id_2' }),
        ]);

      await expect(sut.execute(requestDTO)).rejects.toThrow(
        new BadRequestException('Duplicate position(s) found: 1'),
      );
    });
  });
});
