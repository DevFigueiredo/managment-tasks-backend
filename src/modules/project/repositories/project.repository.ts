import { Inject, Injectable } from '@nestjs/common';
import { PrismaClient, Project as PrismaProject } from '@prisma/client';
import { Project } from '@shared/domain/project';

export namespace IProjectRepository {
  export interface GetParams {
    id: string;
  }
  export interface GetOneParams {
    id: string;
  }
  export interface UpdateData extends Partial<Project> {}
  export interface UpdateParams {
    id: string;
  }
  export interface DeleteParams {
    id: string;
  }
  export interface Repository {
    create(project: Partial<Project>): Promise<PrismaProject>;
    get(): Promise<PrismaProject[]>;
    getOne(params: GetOneParams): Promise<PrismaProject | null>;
    update(params: UpdateParams, project: UpdateData): Promise<PrismaProject>;
    delete(params: DeleteParams): Promise<PrismaProject>;
  }
}

@Injectable()
export class ProjectRepository implements IProjectRepository.Repository {
  constructor(@Inject('db') private readonly db: PrismaClient) {}

  async create(project: Partial<Project>): Promise<PrismaProject> {
    return this.db.project.create({
      data: {
        name: project.name || null,
        description: project.description || null,
        startDate: project.startDate || null,
        endDate: project.endDate || null,
      },
    });
  }

  async get(): Promise<PrismaProject[]> {
    return this.db.project.findMany();
  }

  async getOne(
    params: IProjectRepository.GetOneParams,
  ): Promise<PrismaProject | null> {
    return this.db.project.findUnique({
      where: { id: params.id },
    });
  }

  async update(
    params: IProjectRepository.UpdateParams,
    project: IProjectRepository.UpdateData,
  ): Promise<PrismaProject> {
    return this.db.project.update({
      where: { id: params.id },
      data: {
        name: project.name,
        description: project.description,
        startDate: project.startDate,
        endDate: project.endDate,
      },
    });
  }

  async delete(
    params: IProjectRepository.DeleteParams,
  ): Promise<PrismaProject> {
    return this.db.project.delete({
      where: { id: params.id },
    });
  }
}
