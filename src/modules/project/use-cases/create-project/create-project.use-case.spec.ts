import { Test, TestingModule } from '@nestjs/testing';
import { CreateProjectUseCase } from './create-project.use-case';
import { ProjectRepository } from '../../infra/database/repositories/project.repository';
import { CreateProjectUseCaseRequestDTO } from './create-project.use-case.dto';
import { MockProxy, mock } from 'jest-mock-extended';
import { IProjectRepository } from '../../infra/database/repositories/interfaces/project.repository-interface';
import { DateTime } from 'luxon';
import { ProjectFactory } from '@test/factories/project.factory';

describe('CreateProjectUseCase', () => {
  let sut: CreateProjectUseCase;
  const projectRepository: MockProxy<IProjectRepository.Repository> = mock();

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateProjectUseCase,
        { provide: ProjectRepository, useValue: projectRepository },
      ],
    }).compile();

    sut = module.get<CreateProjectUseCase>(CreateProjectUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  describe('execute', () => {
    it('should create a project with valid input data', async () => {
      const params: CreateProjectUseCaseRequestDTO = {
        name: 'Test Project',
        description: 'A project for testing',
        startDate: DateTime.now().plus({ days: 1 }).toISO(),
        endDate: DateTime.now().plus({ days: 2 }).toISO(),
      };
      const stubProject = ProjectFactory();
      stubProject.name = params.name;
      stubProject.description = params.description;
      stubProject.startDate = params.startDate;
      stubProject.endDate = params.endDate;

      jest.spyOn(projectRepository, 'create').mockResolvedValueOnce({
        id: stubProject.id,
        name: stubProject.name,
        description: stubProject.description,
        startDate: stubProject.startDate as Date,
        endDate: stubProject.endDate as Date,
        createdAt: stubProject.createdAt,
        updatedAt: stubProject.updatedAt,
      });

      const result = await sut.execute(params);

      expect(projectRepository.create).toHaveBeenCalledWith({
        name: params.name,
        description: params.description,
        startDate: params.startDate,
        endDate: params.endDate,
      });
      expect(result).toEqual({
        id: stubProject.id,
      });
    });

    it('should throw an error if endDate is in the past', async () => {
      const params: CreateProjectUseCaseRequestDTO = {
        name: 'Test Project',
        description: 'A project for testing',
        startDate: DateTime.now().plus({ days: 1 }).toISO(),
        endDate: DateTime.now().minus({ days: 1 }).toISO(),
      };

      await expect(sut.execute(params)).rejects.toThrow(
        'A data de término não pode ser menor que a data atual.',
      );
      expect(projectRepository.create).not.toHaveBeenCalled();
    });

    it('should throw an error if startDate is after endDate', async () => {
      const params: CreateProjectUseCaseRequestDTO = {
        name: 'Test Project',
        description: 'A project for testing',
        startDate: DateTime.now().plus({ days: 2 }).toISO(),
        endDate: DateTime.now().plus({ days: 1 }).toISO(),
      };

      await expect(sut.execute(params)).rejects.toThrow(
        'A data de início não pode ser maior que a data de término.',
      );
      expect(projectRepository.create).not.toHaveBeenCalled();
    });

    it('should use current date as startDate if not provided', async () => {
      const params: CreateProjectUseCaseRequestDTO = {
        name: 'Test Project',
        description: 'A project for testing',
        endDate: DateTime.now().plus({ days: 1 }).toISO(),
        startDate: undefined,
      };
      const stubProject = ProjectFactory();
      stubProject.name = params.name;
      stubProject.description = params.description;
      stubProject.startDate = params.startDate;
      stubProject.endDate = params.endDate;

      jest.spyOn(projectRepository, 'create').mockResolvedValueOnce({
        id: stubProject.id,
        name: stubProject.name,
        description: stubProject.description,
        startDate: stubProject.startDate as Date,
        endDate: stubProject.endDate as Date,
        createdAt: stubProject.createdAt,
        updatedAt: stubProject.updatedAt,
      });

      const result = await sut.execute(params);

      expect(projectRepository.create).toHaveBeenCalledWith({
        name: params.name,
        description: params.description,
        startDate: expect.any(Date),
        endDate: params.endDate,
      });
      expect(result).toEqual({
        id: stubProject.id,
      });
    });
  });
});
