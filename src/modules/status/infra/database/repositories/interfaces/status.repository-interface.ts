import { Status } from '@shared/domain/status';

export namespace IStatusRepository {
  export interface GetParams {
    projectId?: string;
  }

  export interface Repository {
    get(params: GetParams): Promise<Status[]>;
  }
}
