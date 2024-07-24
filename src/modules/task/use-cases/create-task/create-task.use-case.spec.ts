import { Test, TestingModule } from '@nestjs/testing';
import { CreateTaskUseCase } from './create-task.use-case';
import { TaskRepository } from '../../infra/database/repositories/task.repository';
import { ProjectRepository } from '@src/modules/project/infra/database/repositories/project.repository';
import { ITaskRepository } from '../../infra/database/repositories/interfaces/task.repository-interface';
import { IProjectRepository } from '@src/modules/project/infra/database/repositories/interfaces/project.repository-interface';
import { MockProxy, mock } from 'jest-mock-extended';
import { CreateTaskUseCaseRequestDTO } from './create-task.use-case.dto';
import { NotFoundException } from '@nestjs/common';
import { TaskFactory } from '@test/factories/task.factory';

describe('CreateTaskUseCase', () => {
  let sut: CreateTaskUseCase;
  const taskRepository: MockProxy<ITaskRepository.Repository> = mock();
  const projectRepository: MockProxy<IProjectRepository.Repository> = mock();

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateTaskUseCase,
        { provide: TaskRepository, useValue: taskRepository },
        { provide: ProjectRepository, useValue: projectRepository },
      ],
    }).compile();

    sut = module.get<CreateTaskUseCase>(CreateTaskUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  describe('execute', () => {
    it('should create a task and add it to the project with valid input data', async () => {
      const params: CreateTaskUseCaseRequestDTO = {
        title: 'New Task',
        text: 'Task Description',
        endDate: new Date().toISOString(),
        statusId: 'status_id',
        projectId: 'existing_project_id',
      };

      const taskStub = TaskFactory();
      jest.spyOn(projectRepository, 'getOne').mockResolvedValueOnce({
        id: params.projectId,
        name: 'Project Name',
        description: 'Project Description',
        startDate: new Date(),
        endDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      jest.spyOn(taskRepository, 'create').mockResolvedValueOnce(taskStub);
      jest
        .spyOn(taskRepository, 'addTaskToProject')
        .mockResolvedValueOnce(undefined);

      const result = await sut.execute(params);

      expect(projectRepository.getOne).toHaveBeenCalledWith({
        id: params.projectId,
      });
      expect(taskRepository.create).toHaveBeenCalledWith({
        title: params.title,
        text: params.text,
        endDate: params.endDate,
        statusId: params.statusId,
      });
      expect(taskRepository.addTaskToProject).toHaveBeenCalledWith(
        taskStub.id,
        params.projectId,
      );
      expect(result).toEqual({ id: taskStub.id });
    });

    it('should throw an error if the project does not exist', async () => {
      const params: CreateTaskUseCaseRequestDTO = {
        title: 'New Task',
        text: 'Task Description',
        endDate: new Date().toISOString(),
        statusId: 'status_id',
        projectId: 'non_existent_project_id',
      };

      jest.spyOn(projectRepository, 'getOne').mockResolvedValueOnce(null);

      await expect(sut.execute(params)).rejects.toThrow(
        new NotFoundException(`Project with ID ${params.projectId} not found`),
      );
      expect(taskRepository.create).not.toHaveBeenCalled();
      expect(taskRepository.addTaskToProject).not.toHaveBeenCalled();
    });
  });
});
