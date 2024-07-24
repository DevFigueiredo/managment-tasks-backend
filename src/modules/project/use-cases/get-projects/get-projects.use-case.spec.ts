import { Test, TestingModule } from '@nestjs/testing';
import { GetProjectsUseCase } from './get-projects.use-case';
import { ProjectRepository } from '../../infra/database/repositories/project.repository';
import { TaskRepository } from '@src/modules/task/infra/database/repositories/task.repository';
import { MockProxy, mock } from 'jest-mock-extended';
import { IProjectRepository } from '../../infra/database/repositories/interfaces/project.repository-interface';
import { ITaskRepository } from '@src/modules/task/infra/database/repositories/interfaces/task.repository-interface';
import { calculateCompletionPercentage } from '@shared/utils/calculate-percentage';
import { checkIfDelayed } from '@shared/utils/check-if-delayed';
import { ProjectFactory } from '@test/factories/project.factory';
import { TaskFactory } from '@test/factories/task.factory';
import { Project } from '@src/shared/domain/project';

jest.mock('@shared/utils/calculate-percentage');
jest.mock('@shared/utils/check-if-delayed');

describe('GetProjectsUseCase', () => {
  let sut: GetProjectsUseCase;
  const projectRepository: MockProxy<IProjectRepository.Repository> = mock();
  const taskRepository: MockProxy<ITaskRepository.Repository> = mock();

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetProjectsUseCase,
        { provide: ProjectRepository, useValue: projectRepository },
        { provide: TaskRepository, useValue: taskRepository },
      ],
    }).compile();

    sut = module.get<GetProjectsUseCase>(GetProjectsUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  describe('execute', () => {
    it('should return projects with completion percentage and delay status', async () => {
      const projects = [ProjectFactory()];
      const tasks = [TaskFactory()];
      const completionPercentage = 75;
      const isDelayed = false;

      jest
        .spyOn(projectRepository, 'get')
        .mockResolvedValueOnce(projects as Project[]);
      jest.spyOn(taskRepository, 'get').mockResolvedValueOnce(tasks);

      (calculateCompletionPercentage as jest.Mock).mockReturnValueOnce(
        completionPercentage,
      );
      (checkIfDelayed as jest.Mock).mockReturnValueOnce(isDelayed);

      const result = await sut.execute();

      expect(projectRepository.get).toHaveBeenCalled();
      expect(jest.spyOn(taskRepository, 'get')).toHaveBeenCalledWith({
        projectId: projects[0].id,
      });
      expect(calculateCompletionPercentage).toHaveBeenCalledWith(tasks);
      expect(checkIfDelayed).toHaveBeenCalledWith(
        projects[0].endDate,
        completionPercentage,
      );
      expect(result).toEqual([
        {
          ...projects[0],
          completionPercentage,
          isDelayed,
        },
      ]);
    });

    it('should handle empty project list', async () => {
      jest.spyOn(projectRepository, 'get').mockResolvedValueOnce([]);

      const result = await sut.execute();

      expect(projectRepository.get).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });
});
