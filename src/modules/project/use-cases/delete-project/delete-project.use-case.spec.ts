import { Test, TestingModule } from '@nestjs/testing';
import { DeleteProjectUseCase } from './delete-project.use-case';
import { TaskRepository } from '@src/modules/task/infra/database/repositories/task.repository';
import { ProjectRepository } from '../../infra/database/repositories/project.repository';
import { DeleteProjectUseCaseRequestDTO } from './delete-project.use-case.dto';
import { MockProxy, mock } from 'jest-mock-extended';
import { ITaskRepository } from '@src/modules/task/infra/database/repositories/interfaces/task.repository-interface';
import { IProjectRepository } from '../../infra/database/repositories/interfaces/project.repository-interface';
import { NotFoundException } from '@nestjs/common';

describe('DeleteProjectUseCase', () => {
  let sut: DeleteProjectUseCase;
  const taskRepository: MockProxy<ITaskRepository.Repository> = mock();
  const projectRepository: MockProxy<IProjectRepository.Repository> = mock();

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteProjectUseCase,
        { provide: TaskRepository, useValue: taskRepository },
        { provide: ProjectRepository, useValue: projectRepository },
      ],
    }).compile();

    sut = module.get<DeleteProjectUseCase>(DeleteProjectUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  describe('execute', () => {
    it('should delete a project and its tasks with valid input data', async () => {
      const params: DeleteProjectUseCaseRequestDTO = {
        id: 'existing_project_id',
      };

      jest.spyOn(projectRepository, 'getOne').mockResolvedValueOnce({
        id: params.id,
        name: 'Project Name',
        description: 'Project Description',
        startDate: new Date(),
        endDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      jest.spyOn(taskRepository, 'deleteAll').mockResolvedValueOnce(undefined);
      jest.spyOn(projectRepository, 'delete').mockResolvedValueOnce(undefined);

      await sut.execute(params);

      expect(projectRepository.getOne).toHaveBeenCalledWith({ id: params.id });
      expect(taskRepository.deleteAll).toHaveBeenCalledWith({
        projectId: params.id,
      });
      expect(projectRepository.delete).toHaveBeenCalledWith({ id: params.id });
    });

    it('should throw an error if project is not found', async () => {
      const params: DeleteProjectUseCaseRequestDTO = {
        id: 'non_existent_id',
      };

      jest.spyOn(projectRepository, 'getOne').mockResolvedValueOnce(null);

      await expect(sut.execute(params)).rejects.toThrow(
        new NotFoundException('Project not found'),
      );
      expect(taskRepository.deleteAll).not.toHaveBeenCalled();
      expect(projectRepository.delete).not.toHaveBeenCalled();
    });
  });
});
