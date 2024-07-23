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
  export interface DeleteAllParams {
    projectId: string;
  }

  export interface UpdateTaskPositionsParams {
    projectId: string;
    tasks: {
      taskId: string;
      position: number;
    }[];
  }

  export interface Repository {
    create(task: Partial<Task>): Promise<PrismaTask>;
    get(params: GetParams): Promise<Task[]>;
    getOne(params: GetOneParams): Promise<Task | null>;
    update(params: UpdateParams, task: UpdateData): Promise<PrismaTask>;
    delete(params: DeleteParams): Promise<PrismaTask>;
    addTaskToProject(
      taskId: string,
      projectId: string,
      position?: number,
    ): Promise<void>;
    removeTaskFromProject(taskId: string): Promise<void>;
    updateTaskPositions(params: UpdateTaskPositionsParams): Promise<void>;
    deleteAll(params: DeleteAllParams): Promise<void>;
  }
}
