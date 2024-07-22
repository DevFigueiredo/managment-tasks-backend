import { Inject } from '@nestjs/common';
import { PrismaClient, Task as PrismaTask } from '@prisma/client';
import { Task } from '@shared/domain/task';

export class TaskRepository {
  constructor(@Inject('db') private readonly db: PrismaClient) {}

  async create(task: Task): Promise<PrismaTask> {
    return this.db.task.create({
      data: task,
    });
  }

  async findAll(): Promise<PrismaTask[]> {
    return this.db.task.findMany();
  }

  async findById(id: string): Promise<PrismaTask | null> {
    return this.db.task.findUnique({
      where: { id },
    });
  }

  async update(id: string, task: Partial<Task>): Promise<PrismaTask> {
    return this.db.task.update({
      where: { id },
      data: task,
    });
  }

  async delete(id: string): Promise<PrismaTask> {
    return this.db.task.delete({
      where: { id },
    });
  }
}
