import { Inject, Injectable } from '@nestjs/common';
import { Task } from '@shared/domain/task';
import { ITaskRepository } from './interfaces/task.repository-interface';
import { PrismaClient } from '@prisma/client';
import { Task as PrismaTask } from '@prisma/client';

@Injectable()
export class TaskRepository implements ITaskRepository.Repository {
  constructor(@Inject('db') private readonly db: PrismaClient) {}

  async create(task: Task): Promise<PrismaTask> {
    return this.db.task.create({
      data: {
        id: task.id,
        statusId: task.statusId,
        text: task.text,
        title: task.title,
        startDate: task.startDate,
        endDate: task.endDate,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
      },
    });
  }

  async get(params: ITaskRepository.GetParams): Promise<Task[]> {
    const tasks = await this.db.task.findMany({
      include: {
        Status: true,
        ProjectTask: {
          select: {
            projectId: true,
            position: true,
            taskId: true,
            Project: true,
          },
        },
      },
      where: {
        ProjectTask: {
          every: {
            projectId: params.projectId,
          },
        },
      },
    });
    tasks.sort((a, b) => {
      const positionA = a.ProjectTask[0]?.position ?? 0;
      const positionB = b.ProjectTask[0]?.position ?? 0;
      return positionA - positionB;
    });

    return tasks;
  }

  async getOne(params: ITaskRepository.GetOneParams): Promise<Task | null> {
    return this.db.task.findUnique({
      where: {
        id: params.id,
      },
      include: {
        ProjectTask: {
          select: {
            projectId: true,
            position: true,
            taskId: true,
            Project: true,
          },
        },
        Status: true,
      },
    });
  }

  async update(
    params: ITaskRepository.UpdateParams,
    task: ITaskRepository.UpdateData,
  ): Promise<PrismaTask> {
    return this.db.task.update({
      where: { id: params.id },
      data: {
        statusId: task.statusId,
        text: task.text,
        title: task.title,
        startDate: task.startDate,
        endDate: task.endDate,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
      },
    });
  }

  async delete(params: ITaskRepository.DeleteParams): Promise<PrismaTask> {
    return this.db.task.delete({
      where: { id: params.id },
    });
  }

  async addTaskToProject(
    taskId: string,
    projectId: string,
    position?: number,
  ): Promise<void> {
    await this.db.projectTask.create({
      data: {
        taskId,
        projectId,
        position,
      },
    });
  }

  async removeTaskFromProject(taskId: string): Promise<void> {
    const projectTasks = await this.db.projectTask.findMany({
      where: { taskId },
    });

    const deletePromises = projectTasks.map(({ projectId, taskId }) =>
      this.db.projectTask.delete({
        where: { projectId_taskId: { projectId, taskId } },
      }),
    );

    await Promise.all(deletePromises);
  }
  async deleteAll({
    projectId,
  }: ITaskRepository.DeleteAllParams): Promise<void> {
    await this.db.$transaction(async (transaction) => {
      await transaction.projectTask.deleteMany({
        where: { projectId },
      });
      await transaction.task.deleteMany({
        where: {
          ProjectTask: {
            every: {
              projectId,
            },
          },
        },
      });
    });
  }

  async updateTaskPositions(
    params: ITaskRepository.UpdateTaskPositionsParams,
  ): Promise<void> {
    const { projectId, tasks } = params;

    await this.db.$transaction(
      tasks.map((task) =>
        this.db.projectTask.update({
          where: {
            projectId_taskId: {
              projectId,
              taskId: task.taskId,
            },
          },
          data: {
            position: task.position,
          },
        }),
      ),
    );
  }
}
