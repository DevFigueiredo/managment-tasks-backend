import { Test, TestingModule } from '@nestjs/testing';
import { ProjectRepository } from './project.repository';
import { Project } from '@shared/domain/project';
import { ProjectFactory } from '@test/factories/project.factory';
import { mockDeep, mockReset } from 'jest-mock-extended';
import { PrismaClient, Project as PrismaProject } from '@prisma/client';

describe('ProjectRepository', () => {
  let repository: ProjectRepository;
  const prisma = mockDeep<PrismaClient>() as any;

  beforeEach(async () => {
    mockReset(prisma);
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProjectRepository, { provide: 'db', useValue: prisma }],
    }).compile();

    repository = module.get<ProjectRepository>(ProjectRepository);
  });

  describe('create', () => {
    it('should create a new project and return it', async () => {
      const project: Partial<Project> = ProjectFactory();

      jest
        .spyOn(prisma.project, 'create')
        .mockResolvedValueOnce(project as PrismaProject);

      const result = await repository.create(project);

      expect(prisma.project.create).toHaveBeenCalledWith({
        data: {
          name: project.name || null,
          description: project.description || null,
          startDate: project.startDate || null,
          endDate: project.endDate || null,
        },
      });
      expect(result).toEqual(project);
    });
  });

  describe('get', () => {
    it('should return a list of projects', async () => {
      const projects: Project[] = [ProjectFactory(), ProjectFactory()];

      jest
        .spyOn(prisma.project, 'findMany')
        .mockResolvedValueOnce(projects as any);

      const result = await repository.get();

      expect(prisma.project.findMany).toHaveBeenCalled();
      expect(result).toEqual(projects);
    });
  });

  describe('getOne', () => {
    it('should return a single project for the given id', async () => {
      const projectId = 'test_project_id';
      const project = ProjectFactory();

      jest
        .spyOn(prisma.project, 'findUnique')
        .mockResolvedValueOnce(project as any);

      const result = await repository.getOne({ id: projectId });

      expect(prisma.project.findUnique).toHaveBeenCalledWith({
        where: { id: projectId },
      });
      expect(result).toEqual(project);
    });
  });

  describe('update', () => {
    it('should update the project with the given id', async () => {
      const projectId = 'test_project_id';
      const updatedProject: Partial<Project> = {
        name: 'Updated Project Name',
        description: 'Updated Project Description',
        startDate: new Date(),
        endDate: new Date(),
      };

      jest
        .spyOn(prisma.project, 'update')
        .mockResolvedValueOnce(updatedProject as any);

      const result = await repository.update({ id: projectId }, updatedProject);

      expect(prisma.project.update).toHaveBeenCalledWith({
        where: { id: projectId },
        data: {
          name: updatedProject.name,
          description: updatedProject.description,
          startDate: updatedProject.startDate,
          endDate: updatedProject.endDate,
        },
      });
      expect(result).toEqual(updatedProject);
    });
  });

  describe('delete', () => {
    it('should delete the project with the given id', async () => {
      const projectId = 'test_project_id';

      jest
        .spyOn(prisma.project, 'delete')
        .mockResolvedValueOnce({ id: projectId } as any);

      const result = await repository.delete({ id: projectId });

      expect(prisma.project.delete).toHaveBeenCalledWith({
        where: { id: projectId },
      });
      expect(result).toEqual({ id: projectId });
    });
  });
});
