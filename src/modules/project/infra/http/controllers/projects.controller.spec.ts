import { Test, TestingModule } from '@nestjs/testing';
import { MockProxy, mock } from 'jest-mock-extended';
import { CreateProjectUseCase } from '@src/modules/project/use-cases/create-project/create-project.use-case';
import { DeleteProjectUseCase } from '@src/modules/project/use-cases/delete-project/delete-project.use-case';
import { GetDetailProjectUseCase } from '@src/modules/project/use-cases/get-detail-projects/get-detail-projects.use-case';
import { GetProjectsUseCase } from '@src/modules/project/use-cases/get-projects/get-projects.use-case';
import { UpdateProjectUseCase } from '@src/modules/project/use-cases/update-project/update-project.use-case';
import { GetDetailProjectUseCaseResponseDTO } from '@src/modules/project/use-cases/get-detail-projects/get-detail-projects.use-case.dto';
import { GetProjectUseCaseResponseDTO } from '@src/modules/project/use-cases/get-projects/get-projects.use-case.dto';
import { UpdateProjectUseCaseRequestDTO } from '@src/modules/project/use-cases/update-project/update-project.use-case.dto';
import {
  CreateProjectUseCaseRequestDTO,
  CreateProjectUseCaseResponseDTO,
} from '@src/modules/project/use-cases/create-project/create-project.use-case.dto';
import { ProjectController } from './projects.controller';

describe('ProjectController', () => {
  let sut: ProjectController;
  const getProjectsUseCase: MockProxy<GetProjectsUseCase> = mock();
  const createProjectUseCase: MockProxy<CreateProjectUseCase> = mock();
  const updateProjectUseCase: MockProxy<UpdateProjectUseCase> = mock();
  const getDetailProjectUseCase: MockProxy<GetDetailProjectUseCase> = mock();
  const deleteProjectUseCase: MockProxy<DeleteProjectUseCase> = mock();

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectController],
      providers: [
        { provide: GetProjectsUseCase, useValue: getProjectsUseCase },
        { provide: CreateProjectUseCase, useValue: createProjectUseCase },
        { provide: UpdateProjectUseCase, useValue: updateProjectUseCase },
        { provide: GetDetailProjectUseCase, useValue: getDetailProjectUseCase },
        { provide: DeleteProjectUseCase, useValue: deleteProjectUseCase },
      ],
    }).compile();

    sut = module.get<ProjectController>(ProjectController);
  });

  describe('get', () => {
    it('should return a list of projects', async () => {
      const projects: GetProjectUseCaseResponseDTO[] = [
        {
          id: '1',
          name: 'Project 1',
          completionPercentage: 0,
          isDelayed: false,
          description: '',
          startDate: '',
          endDate: '',
          createdAt: undefined,
          updatedAt: undefined,
        },
        {
          id: '2',
          name: 'Project 2',
          completionPercentage: 0,
          isDelayed: false,
          description: '',
          startDate: '',
          endDate: '',
          createdAt: undefined,
          updatedAt: undefined,
        },
      ];
      jest.spyOn(getProjectsUseCase, 'execute').mockResolvedValue(projects);

      const result = await sut.get();

      expect(result).toEqual(projects);
      expect(getProjectsUseCase.execute).toHaveBeenCalled();
      expect(getProjectsUseCase.execute).toHaveBeenCalledTimes(1);
    });
  });

  describe('create', () => {
    it('should create a new project and return it', async () => {
      const createProjectDto: CreateProjectUseCaseRequestDTO = {
        name: 'New Project',
        description: 'Project Description',
        startDate: '',
        endDate: '',
      };
      const createdProject: CreateProjectUseCaseResponseDTO = {
        id: '1',
        ...createProjectDto,
      };
      jest
        .spyOn(createProjectUseCase, 'execute')
        .mockResolvedValue(createdProject);

      const result = await sut.create(createProjectDto);

      expect(result).toEqual(createdProject);
      expect(createProjectUseCase.execute).toHaveBeenCalledWith(
        createProjectDto,
      );
      expect(createProjectUseCase.execute).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    it('should update a project and return no content', async () => {
      const updateDto: UpdateProjectUseCaseRequestDTO = {
        name: 'Updated Project',
        description: 'Updated Description',
        id: '',
        endDate: '',
      };
      const projectId = '1';
      await sut.update(updateDto, projectId);

      expect(updateProjectUseCase.execute).toHaveBeenCalledWith({
        ...updateDto,
        id: projectId,
      });
      expect(updateProjectUseCase.execute).toHaveBeenCalledTimes(1);
    });
  });

  describe('getDetail', () => {
    it('should return project details for the given id', async () => {
      const projectId = '1';
      const projectDetail: GetDetailProjectUseCaseResponseDTO = {
        id: '1',
        name: 'Detailed Project',
        description: 'Detailed Description',
        completionPercentage: 0,
        isDelayed: false,
        startDate: '',
        endDate: '',
        createdAt: undefined,
        updatedAt: undefined,
      };
      jest
        .spyOn(getDetailProjectUseCase, 'execute')
        .mockResolvedValue(projectDetail);

      const result = await sut.getDetail(projectId);

      expect(result).toEqual(projectDetail);
      expect(getDetailProjectUseCase.execute).toHaveBeenCalledWith({
        id: projectId,
      });
      expect(getDetailProjectUseCase.execute).toHaveBeenCalledTimes(1);
    });
  });

  describe('delete', () => {
    it('should delete a project and return no content', async () => {
      const projectId = '1';
      await sut.delete(projectId);

      expect(deleteProjectUseCase.execute).toHaveBeenCalledWith({
        id: projectId,
      });
      expect(deleteProjectUseCase.execute).toHaveBeenCalledTimes(1);
    });
  });
});
