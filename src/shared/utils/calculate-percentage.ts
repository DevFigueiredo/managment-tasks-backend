import { Task } from '@shared/domain/task';
import { StatusTypeEnum } from './enums/status.enum';

export function calculateCompletionPercentage(tasks: Task[]): number {
  if (tasks.length === 0) return 0;
  const completedTasks = tasks.filter(
    (task) => task.Status.type === StatusTypeEnum.closed,
  ).length;
  return Math.round((completedTasks / tasks.length) * 100);
}
