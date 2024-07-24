import { Task } from '@shared/domain/task';
import { StatusTypeEnum } from './enums/status.enum';
import { StatusFactory } from '@test/factories/status.factory';
import { calculateCompletionPercentage } from './calculate-percentage';

describe('calculateCompletionPercentage', () => {
  it('should return 0% if there are no tasks', () => {
    const tasks: Task[] = [];
    const result = calculateCompletionPercentage(tasks);
    expect(result).toBe(0);
  });

  it('should return 0% if all tasks are incomplete', () => {
    const tasks: Task[] = [
      {
        id: '1',
        text: 'Task 1',
        title: 'Task 1',
        startDate: new Date(),
        endDate: new Date(),
        statusId: '1',
        Status: StatusFactory({ type: StatusTypeEnum.pending }),
        ProjectTask: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        text: 'Task 2',
        title: 'Task 2',
        startDate: new Date(),
        endDate: new Date(),
        statusId: '2',
        Status: StatusFactory({ type: StatusTypeEnum.inprogress }),
        ProjectTask: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    const result = calculateCompletionPercentage(tasks);
    expect(result).toBe(0);
  });

  it('should return 100% if all tasks are completed', () => {
    const tasks: Task[] = [
      {
        id: '1',
        text: 'Task 1',
        title: 'Task 1',
        startDate: new Date(),
        endDate: new Date(),
        statusId: '1',
        Status: StatusFactory({ type: StatusTypeEnum.closed }),
        ProjectTask: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        text: 'Task 2',
        title: 'Task 2',
        startDate: new Date(),
        endDate: new Date(),
        statusId: '2',
        Status: StatusFactory({ type: StatusTypeEnum.closed }),
        ProjectTask: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    const result = calculateCompletionPercentage(tasks);
    expect(result).toBe(100);
  });

  it('should return 50% if tasks are completed', () => {
    const tasks: Task[] = [
      {
        id: '1',
        text: 'Task 1',
        title: 'Task 1',
        startDate: new Date(),
        endDate: new Date(),
        statusId: '1',
        Status: StatusFactory({ type: StatusTypeEnum.closed }),
        ProjectTask: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        text: 'Task 2',
        title: 'Task 2',
        startDate: new Date(),
        endDate: new Date(),
        statusId: '2',
        Status: StatusFactory({ type: StatusTypeEnum.inprogress }),
        ProjectTask: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    const result = calculateCompletionPercentage(tasks);
    expect(result).toBe(50);
  });
});
