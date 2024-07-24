import { Test, TestingModule } from '@nestjs/testing';
import { UpdateProjectUseCase } from './update-project.use-case';
import { ProjectRepository } from '../../infra/database/repositories/project.repository';
import { UpdateProjectUseCaseRequestDTO } from './update-project.use-case.dto';
import { MockProxy, mock } from 'jest-mock-extended';
import { IProjectRepository } from '../../infra/database/repositories/interfaces/project.repository-interface';
import { DateTime } from 'luxon';
import { ProjectFactory } from '@test/factories/project.factory';
import { BadRequestException } from '@nestjs/common';

describe('UpdateProjectUseCase', () => {
  let sut: UpdateProjectUseCase;
  const projectRepository: MockProxy<IProjectRepository.Repository> = mock();

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateProjectUseCase,
        { provide: ProjectRepository, useValue: projectRepository },
      ],
    }).compile();

    sut = module.get<UpdateProjectUseCase>(UpdateProjectUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  describe('execute', () => {
    it('should update a project with valid input data', async () => {
      const params: UpdateProjectUseCaseRequestDTO = {
        id: 'existing_project_id',
        name: 'Updated Project Name',
        description: 'Updated description',
        endDate: DateTime.now().plus({ days: 1 }).toISO(),
      };
      const currentProject = ProjectFactory();
      currentProject.id = params.id;
      currentProject.startDate = DateTime.now().plus({ days: 1 }).toJSDate();
      currentProject.endDate = DateTime.now().plus({ days: 2 }).toJSDate();

      jest.spyOn(projectRepository, 'getOne').mockResolvedValueOnce({
        id: currentProject.id,
        name: currentProject.name,
        description: currentProject.description,
        startDate: currentProject.startDate as Date,
        endDate: currentProject.endDate as Date,
        createdAt: currentProject.createdAt,
        updatedAt: currentProject.updatedAt,
      });
      jest.spyOn(projectRepository, 'update').mockResolvedValueOnce(undefined);

      await sut.execute(params);

      expect(projectRepository.getOne).toHaveBeenCalledWith({ id: params.id });
      expect(projectRepository.update).toHaveBeenCalledWith(
        { id: params.id },
        {
          name: params.name,
          description: params.description,
          endDate: params.endDate,
        },
      );
    });

    it('should throw an error if project is not found', async () => {
      const params: UpdateProjectUseCaseRequestDTO = {
        id: 'non_existent_id',
        name: 'Updated Project Name',
        description: 'Updated description',
        endDate: DateTime.now().plus({ days: 1 }).toISO(),
      };

      jest.spyOn(projectRepository, 'getOne').mockResolvedValueOnce(null);

      await expect(sut.execute(params)).rejects.toThrow(
        new BadRequestException('Project not found'),
      );
      expect(projectRepository.update).not.toHaveBeenCalled();
    });

    it('should throw an error if endDate is in the past', async () => {
      const params: UpdateProjectUseCaseRequestDTO = {
        id: 'existing_project_id',
        name: 'Updated Project Name',
        description: 'Updated description',
        endDate: DateTime.now().minus({ days: 1 }).toISO(),
      };
      const currentProject = ProjectFactory();
      currentProject.id = params.id;
      currentProject.endDate = DateTime.now().plus({ days: 2 }).toJSDate();

      jest.spyOn(projectRepository, 'getOne').mockResolvedValueOnce({
        id: currentProject.id,
        name: currentProject.name,
        description: currentProject.description,
        startDate: currentProject.startDate as Date,
        endDate: currentProject.endDate as Date,
        createdAt: currentProject.createdAt,
        updatedAt: currentProject.updatedAt,
      });

      await expect(sut.execute(params)).rejects.toThrow(
        new BadRequestException('End date cannot be in the past'),
      );
      expect(projectRepository.update).not.toHaveBeenCalled();
    });

    it('should throw an error if endDate is before startDate', async () => {
      const params: UpdateProjectUseCaseRequestDTO = {
        id: 'existing_project_id',
        name: 'Updated Project Name',
        description: 'Updated description',
        endDate: DateTime.now().plus({ days: 2 }).toISO(),
      };
      const currentProject = ProjectFactory();
      currentProject.id = params.id;
      currentProject.startDate = DateTime.now().plus({ days: 3 }).toJSDate();
      currentProject.endDate = DateTime.now().plus({ days: 5 }).toJSDate();

      jest.spyOn(projectRepository, 'getOne').mockResolvedValueOnce({
        id: currentProject.id,
        name: currentProject.name,
        description: currentProject.description,
        startDate: currentProject.startDate as Date,
        endDate: currentProject.endDate as Date,
        createdAt: currentProject.createdAt,
        updatedAt: currentProject.updatedAt,
      });

      await expect(sut.execute(params)).rejects.toThrow(
        new BadRequestException('End date cannot be before the start date'),
      );
      expect(projectRepository.update).not.toHaveBeenCalled();
    });
  });
});
