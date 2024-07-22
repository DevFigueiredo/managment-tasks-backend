import { Task as PrismaTask } from '@prisma/client';
import { Task } from '@shared/domain/task';

export namespace ITaskRepository {
  export interface GetParams {
    projectId: string;
  }
  export interface GetOneParams {
    id: string;
  }
  export interface UpdateData extends Partial<Task> {}
  export interface UpdateParams {
    id: string;
  }
  export interface DeleteParams {
    id: string;
  }
  export interface Repository {
    create(task: Partial<Task>): Promise<PrismaTask>;
    get(params: GetParams): Promise<Task[]>;
    getOne(params: GetOneParams): Promise<Task | null>;
    update(params: UpdateParams, task: UpdateData): Promise<PrismaTask>;
    delete(params: DeleteParams): Promise<PrismaTask>;
    addTaskToProject(taskId: string, projectId: string): Promise<void>;
    removeTaskFromProject(taskId: string): Promise<void>;
  }
}
