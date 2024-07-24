import { Test, TestingModule } from '@nestjs/testing';
import { GetDetailProjectUseCase } from './get-detail-projects.use-case';
import { ProjectRepository } from '../../infra/database/repositories/project.repository';
import { TaskRepository } from '@src/modules/task/infra/database/repositories/task.repository';
import { MockProxy, mock } from 'jest-mock-extended';
import { IProjectRepository } from '../../infra/database/repositories/interfaces/project.repository-interface';
import { ITaskRepository } from '@src/modules/task/infra/database/repositories/interfaces/task.repository-interface';
import { calculateCompletionPercentage } from '@shared/utils/calculate-percentage';
import { checkIfDelayed } from '@shared/utils/check-if-delayed';
import { GetDetailProjectUseCaseRequestDTO } from './get-detail-projects.use-case.dto';
import { ProjectFactory } from '@test/factories/project.factory';
import { TaskFactory } from '@test/factories/task.factory';

jest.mock('@shared/utils/calculate-percentage');
jest.mock('@shared/utils/check-if-delayed');

describe('GetDetailProjectUseCase', () => {
  let sut: GetDetailProjectUseCase;
  const projectRepository: MockProxy<IProjectRepository.Repository> = mock();
  const taskRepository: MockProxy<ITaskRepository.Repository> = mock();

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetDetailProjectUseCase,
        { provide: ProjectRepository, useValue: projectRepository },
        { provide: TaskRepository, useValue: taskRepository },
      ],
    }).compile();

    sut = module.get<GetDetailProjectUseCase>(GetDetailProjectUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  describe('execute', () => {
    it('should return project details with completion percentage and delay status', async () => {
      const project = ProjectFactory();
      const tasks = [TaskFactory()];
      const completionPercentage = 75;
      const isDelayed = false;

      jest.spyOn(projectRepository, 'getOne').mockResolvedValueOnce(project);
      jest.spyOn(taskRepository, 'get').mockResolvedValueOnce(tasks);

      (calculateCompletionPercentage as jest.Mock).mockReturnValueOnce(
        completionPercentage,
      );
      (checkIfDelayed as jest.Mock).mockReturnValueOnce(isDelayed);

      const params: GetDetailProjectUseCaseRequestDTO = { id: project.id };
      const result = await sut.execute(params);

      expect(projectRepository.getOne).toHaveBeenCalledWith({ id: params.id });
      expect(taskRepository.get).toHaveBeenCalledWith({
        projectId: project.id,
      });
      expect(calculateCompletionPercentage).toHaveBeenCalledWith(tasks);
      expect(checkIfDelayed).toHaveBeenCalledWith(
        project.endDate as Date,
        completionPercentage,
      );
      expect(result).toEqual({
        ...project,
        completionPercentage,
        isDelayed,
      });
    });

    it('should handle cases where no tasks are found', async () => {
      const project = ProjectFactory();
      const completionPercentage = 0;
      const isDelayed = false;

      jest.spyOn(projectRepository, 'getOne').mockResolvedValueOnce(project);
      jest.spyOn(taskRepository, 'get').mockResolvedValueOnce([]);

      (calculateCompletionPercentage as jest.Mock).mockReturnValueOnce(
        completionPercentage,
      );
      (checkIfDelayed as jest.Mock).mockReturnValueOnce(isDelayed);

      const params: GetDetailProjectUseCaseRequestDTO = { id: project.id };
      const result = await sut.execute(params);

      expect(projectRepository.getOne).toHaveBeenCalledWith({ id: params.id });
      expect(taskRepository.get).toHaveBeenCalledWith({
        projectId: project.id,
      });
      expect(calculateCompletionPercentage).toHaveBeenCalledWith([]);
      expect(checkIfDelayed).toHaveBeenCalledWith(
        project.endDate as Date,
        completionPercentage,
      );
      expect(result).toEqual({
        ...project,
        completionPercentage,
        isDelayed,
      });
    });

    it('should handle project not found scenario', async () => {
      const params: GetDetailProjectUseCaseRequestDTO = {
        id: 'non-existing-id',
      };
      jest.spyOn(projectRepository, 'getOne').mockResolvedValueOnce(null);

      await expect(sut.execute(params)).rejects.toThrow('Project not found');
      expect(projectRepository.getOne).toHaveBeenCalledWith({ id: params.id });
      expect(taskRepository.get).not.toHaveBeenCalled();
    });
  });
});
