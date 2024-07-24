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
    create(project: Partial<Project>): Promise<Project>;
    get(): Promise<Project[]>;
    getOne(params: GetOneParams): Promise<Project | null>;
    update(params: UpdateParams, project: UpdateData): Promise<Project>;
    delete(params: DeleteParams): Promise<Project>;
  }
}
