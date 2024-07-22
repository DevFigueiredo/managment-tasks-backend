import { Task } from '@prisma/client';
import { StatusEnum } from './enums/status.enum';

export function calculateCompletionPercentage(tasks: Task[]): number {
  if (tasks.length === 0) return 0;
  const completedTasks = tasks.filter(
    (task) => task.status === StatusEnum.closed,
  ).length;
  return Math.round((completedTasks / tasks.length) * 100);
}
