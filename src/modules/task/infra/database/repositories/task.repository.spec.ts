import { Test, TestingModule } from '@nestjs/testing';
import { TaskRepository } from './task.repository';
import { Task } from '@shared/domain/task';
import { TaskFactory } from '@test/factories/task.factory';
import { ProjectTasksFactory } from '@test/factories/project-task.factory';
import { mockDeep, mockReset } from 'jest-mock-extended';
import { PrismaClient } from '@prisma/client';

describe('TaskRepository', () => {
  let repository: TaskRepository;
  const prisma = mockDeep<PrismaClient>() as any;

  beforeEach(async () => {
    mockReset(prisma);
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaskRepository, { provide: 'db', useValue: prisma }],
    }).compile();

    repository = module.get<TaskRepository>(TaskRepository);
  });

  describe('create', () => {
    it('should create a new task and return it', async () => {
      const task: Task = TaskFactory();

      jest.spyOn(prisma.task, 'create').mockResolvedValueOnce({
        ...task,
        startDate: task.startDate as Date,
        endDate: task.endDate as Date,
      });

      const result = await repository.create(task);

      expect(prisma.task.create).toHaveBeenCalledWith({
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
      });
      expect(result).toEqual(task);
    });
  });

  describe('get', () => {
    it('should return a list of tasks for the given projectId', async () => {
      const projectId = 'test_project_id';
      const tasks: Task[] = [TaskFactory(), TaskFactory()];

      jest.spyOn(prisma.task, 'findMany').mockResolvedValueOnce(tasks as any);

      const result = await repository.get({ projectId });

      expect(prisma.task.findMany).toHaveBeenCalledWith({
        where: {
          ProjectTask: {
            every: {
              projectId,
            },
          },
        },
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
      });
      expect(result).toEqual(tasks);
    });
  });

  describe('getOne', () => {
    it('should return a single task for the given id', async () => {
      const taskId = 'test_task_id';
      const task = TaskFactory();

      jest.spyOn(prisma.task, 'findUnique').mockResolvedValueOnce(task as any);

      const result = await repository.getOne({ id: taskId });

      expect(prisma.task.findUnique).toHaveBeenCalledWith({
        where: { id: taskId },
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
      expect(result).toEqual(task);
    });
  });

  describe('update', () => {
    it('should update the task with the given id', async () => {
      const taskId = 'test_task_id';
      const updatedTask: Partial<Task> = {
        statusId: 'new_status_id',
        text: 'Updated Task Text',
      };

      jest
        .spyOn(prisma.task, 'update')
        .mockResolvedValueOnce({ ...updatedTask, id: taskId } as any);

      await repository.update({ id: taskId }, updatedTask);

      expect(prisma.task.update).toHaveBeenCalledWith({
        where: { id: taskId },
        data: {
          statusId: updatedTask.statusId,
          text: updatedTask.text,
          title: updatedTask.title,
          startDate: updatedTask.startDate,
          endDate: updatedTask.endDate,
          createdAt: updatedTask.createdAt,
          updatedAt: updatedTask.updatedAt,
        },
      });
    });
  });

  describe('delete', () => {
    it('should delete the task with the given id', async () => {
      const taskId = 'test_task_id';

      jest
        .spyOn(prisma.task, 'delete')
        .mockResolvedValueOnce({ id: taskId } as any);

      await repository.delete({ id: taskId });

      expect(prisma.task.delete).toHaveBeenCalledWith({
        where: { id: taskId },
      });
    });
  });

  describe('addTaskToProject', () => {
    it('should add a task to a project with the given position', async () => {
      const taskId = 'test_task_id';
      const projectId = 'test_project_id';
      const position = 1;

      jest.spyOn(prisma.projectTask, 'create').mockResolvedValueOnce({
        taskId,
        projectId,
        position,
      } as any);

      await repository.addTaskToProject(taskId, projectId, position);

      expect(prisma.projectTask.create).toHaveBeenCalledWith({
        data: {
          taskId,
          projectId,
          position,
        },
      });
    });
  });

  describe('removeTaskFromProject', () => {
    it('should remove a task from all projects', async () => {
      const taskId = 'test_task_id';
      const projectTasks = [
        ProjectTasksFactory({ taskId }),
        ProjectTasksFactory({ taskId }),
      ];

      jest
        .spyOn(prisma.projectTask, 'findMany')
        .mockResolvedValueOnce(projectTasks as any);
      jest.spyOn(prisma.projectTask, 'delete').mockResolvedValueOnce(null);

      await repository.removeTaskFromProject(taskId);

      expect(prisma.projectTask.findMany).toHaveBeenCalledWith({
        where: { taskId },
      });
      expect(prisma.projectTask.delete).toHaveBeenCalledTimes(
        projectTasks.length,
      );
      projectTasks.forEach(({ projectId }) => {
        expect(prisma.projectTask.delete).toHaveBeenCalledWith({
          where: { projectId_taskId: { projectId, taskId } },
        });
      });
    });
  });

  describe('deleteAll', () => {
    it('should delete all tasks and project tasks for a given projectId', async () => {
      const projectId = 'test-project-id';

      await repository.deleteAll({ projectId });

      expect(prisma.$transaction).toHaveBeenCalled();

      const deleteProjectTasks = {
        where: { projectId },
      };

      const deleteTasks = {
        where: {
          ProjectTask: {
            every: {
              projectId,
            },
          },
        },
      };

      expect(prisma.$transaction).toHaveBeenCalledWith(expect.any(Function));
      await prisma.$transaction.mock.calls[0][0](prisma);
      expect(prisma.projectTask.deleteMany).toHaveBeenCalledWith(
        deleteProjectTasks,
      );
      expect(prisma.task.deleteMany).toHaveBeenCalledWith(deleteTasks);
    });
  });

  describe('updateTaskPositions', () => {
    it('should update task positions for the given projectId', async () => {
      const projectId = 'test_project_id';
      const tasks = [
        { taskId: 'task_id_1', position: 1 },
        { taskId: 'task_id_2', position: 2 },
      ];

      await repository.updateTaskPositions({ projectId, tasks });

      expect(prisma.$transaction).toHaveBeenCalled();

      expect(prisma.projectTask.update).toHaveBeenCalledWith({
        where: {
          projectId_taskId: {
            projectId,
            taskId: 'task_id_1',
          },
        },
        data: {
          position: 1,
        },
      });

      expect(prisma.projectTask.update).toHaveBeenCalledWith({
        where: {
          projectId_taskId: {
            projectId,
            taskId: 'task_id_2',
          },
        },
        data: {
          position: 2,
        },
      });
    });
  });
});
