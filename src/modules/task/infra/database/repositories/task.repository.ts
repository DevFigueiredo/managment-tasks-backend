import { Inject, Injectable } from '@nestjs/common';
import { PrismaClient, Task as PrismaTask } from '@prisma/client';
import { Task } from '@shared/domain/task';
export namespace ITaskRepository {
  export interface GetParams {
    projectId: string;
  }
  export interface GetOneParams {
    projectId: string;
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
    create(task: Task): Promise<PrismaTask>;
    get(params: GetParams): Promise<PrismaTask[]>;
    getOne(params: GetParams): Promise<PrismaTask | null>;
    update(params: UpdateParams, task: UpdateData): Promise<PrismaTask>;
    delete(params: DeleteParams): Promise<PrismaTask>;
    addTaskToProject(taskId: string, projectId: string): Promise<void>;
    removeTaskFromProject(taskId: string, projectId: string): Promise<void>;
  }
}

@Injectable()
export class TaskRepository implements ITaskRepository.Repository {
  constructor(@Inject('db') private readonly db: PrismaClient) {}

  async create(task: Task): Promise<PrismaTask> {
    return this.db.task.create({
      data: task,
    });
  }

  async get(params: ITaskRepository.GetParams): Promise<PrismaTask[]> {
    return this.db.task.findMany({
      where: {
        ProjectTask: {
          every: {
            projectId: params.projectId,
          },
        },
      },
    });
  }

  async getOne(
    params: ITaskRepository.GetOneParams,
  ): Promise<PrismaTask | null> {
    return this.db.task.findUnique({
      where: {
        id: params.id,
        ProjectTask: {
          every: {
            projectId: params.projectId,
          },
        },
      },
      include: {
        ProjectTask: true,
      },
    });
  }

  async update(
    params: ITaskRepository.UpdateParams,
    task: ITaskRepository.UpdateData,
  ): Promise<PrismaTask> {
    return this.db.task.update({
      where: { id: params.id },
      data: task,
    });
  }

  async delete(params: ITaskRepository.DeleteParams): Promise<PrismaTask> {
    return this.db.task.delete({
      where: { id: params.id },
    });
  }

  async addTaskToProject(taskId: string, projectId: string): Promise<void> {
    await this.db.projectTask.create({
      data: {
        taskId,
        projectId,
      },
    });
  }

  async removeTaskFromProject(
    taskId: string,
    projectId: string,
  ): Promise<void> {
    await this.db.projectTask.delete({
      where: {
        projectId_taskId: {
          taskId,
          projectId,
        },
      },
    });
  }
}
