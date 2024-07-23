import { Status } from '@shared/domain/status';

export namespace IStatusRepository {
  export interface GetParams {
    projectId?: string;
  }
  export interface GetOneParams {
    id?: string;
  }
  export interface Repository {
    get(params: GetParams): Promise<Status[]>;
    getOne(params: GetOneParams): Promise<Status>;
  }
}
