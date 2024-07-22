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
        id: task.id || undefined, // Não forneça `null` para o ID
        statusId: task.statusId, // Certifique-se de que o statusId é fornecido
        text: task.text || undefined,
        title: task.title || undefined,
        startDate: task.startDate || undefined,
        endDate: task.endDate || undefined,
        createdAt: task.createdAt || undefined,
        updatedAt: task.updatedAt || undefined,
      },
    });
  }

  async get(params: ITaskRepository.GetParams): Promise<Task[]> {
    return this.db.task.findMany({
      include: {
        Status: true,
        ProjectTask: {
          select: {
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
  }

  async getOne(params: ITaskRepository.GetOneParams): Promise<Task | null> {
    return this.db.task.findUnique({
      where: {
        id: params.id,
      },
      include: {
        ProjectTask: {
          select: {
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

  async addTaskToProject(taskId: string, projectId: string): Promise<void> {
    await this.db.projectTask.create({
      data: {
        taskId,
        projectId,
      },
    });
  }

  async removeTaskFromProject(taskId: string): Promise<void> {
    // Encontre todas as relações associadas ao taskId
    const projectTasks = await this.db.projectTask.findMany({
      where: { taskId },
    });

    // Exclua cada relação encontrada
    const deletePromises = projectTasks.map(({ projectId, taskId }) =>
      this.db.projectTask.delete({
        where: { projectId_taskId: { projectId, taskId } },
      }),
    );

    await Promise.all(deletePromises);
  }
}
