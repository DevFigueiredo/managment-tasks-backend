import { Project as PrismaProject } from '@prisma/client';
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
