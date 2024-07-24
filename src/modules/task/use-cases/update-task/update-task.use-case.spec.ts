import { Test, TestingModule } from '@nestjs/testing';
import { UpdateTaskUseCase } from './update-task.use-case';
import { TaskRepository } from '../../infra/database/repositories/task.repository';
import { ProjectRepository } from '@src/modules/project/infra/database/repositories/project.repository';
import { StatusRepository } from '@src/modules/status/infra/database/repositories/status.repository';
import { ITaskRepository } from '../../infra/database/repositories/interfaces/task.repository-interface';
import { IProjectRepository } from '@src/modules/project/infra/database/repositories/interfaces/project.repository-interface';
import { IStatusRepository } from '@src/modules/status/infra/database/repositories/interfaces/status.repository-interface';
import { UpdateTaskUseCaseRequestDTO } from './update-task.use-case.dto';
import { NotFoundException } from '@nestjs/common';
import { StatusTypeEnum } from '@shared/utils/enums/status.enum';
import { TaskFactory } from '@test/factories/task.factory';
import { StatusFactory } from '@test/factories/status.factory';
import { ProjectFactory } from '@test/factories/project.factory';
import { mock } from 'jest-mock-extended';

describe('UpdateTaskUseCase', () => {
  let sut: UpdateTaskUseCase;
  const taskRepository: ITaskRepository.Repository = mock();
  const projectRepository: IProjectRepository.Repository = mock();
  const statusRepository: IStatusRepository.Repository = mock();

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateTaskUseCase,
        { useValue: taskRepository, provide: TaskRepository },
        { useValue: projectRepository, provide: ProjectRepository },
        { useValue: statusRepository, provide: StatusRepository },
      ],
    }).compile();

    sut = module.get<UpdateTaskUseCase>(UpdateTaskUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  describe('execute', () => {
    it('should update a task with valid input data with status inProgress', async () => {
      const params: UpdateTaskUseCaseRequestDTO = {
        id: 'existing_task_id',
        title: 'Updated Title',
        text: 'Updated Text',
        endDate: new Date().toISOString(),
        statusId: 'existing_status_id',
        projectId: 'existing_project_id',
      };

      const existingTask = TaskFactory({
        id: params.id,
        title: 'Old Title',
        text: 'Old Text',
        startDate: null,
        endDate: null,
        statusId: 'old_status_id',
        ProjectTask: [
          {
            projectId: params.projectId,
            taskId: params.id,
            position: 1,
            Project: Object.create({}),
          },
        ],
      });

      const status = StatusFactory({
        id: params.statusId,
        type: StatusTypeEnum.inprogress,
      });
      const project = ProjectFactory({ id: params.projectId });

      jest.spyOn(taskRepository, 'getOne').mockResolvedValueOnce(existingTask);
      jest.spyOn(statusRepository, 'getOne').mockResolvedValueOnce(status);
      jest.spyOn(projectRepository, 'getOne').mockResolvedValueOnce(project);
      jest.spyOn(taskRepository, 'update').mockResolvedValueOnce(undefined);
      jest
        .spyOn(taskRepository, 'removeTaskFromProject')
        .mockResolvedValueOnce(undefined);
      jest
        .spyOn(taskRepository, 'addTaskToProject')
        .mockResolvedValueOnce(undefined);

      await sut.execute(params);

      expect(taskRepository.getOne).toHaveBeenCalledWith({ id: params.id });
      expect(statusRepository.getOne).toHaveBeenCalledWith({
        id: params.statusId,
      });
      expect(projectRepository.getOne).toHaveBeenCalledWith({
        id: params.projectId,
      });
      expect(taskRepository.update).toHaveBeenCalledWith(
        { id: params.id },
        {
          title: params.title,
          text: params.text,
          startDate: expect.any(Date),
          endDate: params.endDate,
          statusId: params.statusId,
        },
      );
      expect(taskRepository.removeTaskFromProject).toHaveBeenCalledWith(
        params.id,
      );
      expect(taskRepository.addTaskToProject).toHaveBeenCalledWith(
        params.id,
        params.projectId,
        1,
      );
    });

    it('should update a task with valid input data with status Pending', async () => {
      const params: UpdateTaskUseCaseRequestDTO = {
        id: 'existing_task_id',
        title: 'Updated Title',
        text: 'Updated Text',
        endDate: new Date(),
        statusId: 'existing_status_id',
        projectId: 'existing_project_id',
      };

      const existingTask = TaskFactory({
        id: params.id,
        title: 'Old Title',
        text: 'Old Text',
        startDate: null,
        endDate: null,
        statusId: 'old_status_id',
        ProjectTask: [
          {
            projectId: params.projectId,
            taskId: params.id,
            position: 1,
            Project: Object.create({}),
          },
        ],
      });

      const status = StatusFactory({
        id: params.statusId,
        type: StatusTypeEnum.pending,
      });
      const project = ProjectFactory({ id: params.projectId });

      jest.spyOn(taskRepository, 'getOne').mockResolvedValueOnce(existingTask);
      jest.spyOn(statusRepository, 'getOne').mockResolvedValueOnce(status);
      jest.spyOn(projectRepository, 'getOne').mockResolvedValueOnce(project);
      jest.spyOn(taskRepository, 'update').mockResolvedValueOnce(undefined);
      jest
        .spyOn(taskRepository, 'removeTaskFromProject')
        .mockResolvedValueOnce(undefined);
      jest
        .spyOn(taskRepository, 'addTaskToProject')
        .mockResolvedValueOnce(undefined);

      await sut.execute(params);

      expect(taskRepository.getOne).toHaveBeenCalledWith({ id: params.id });
      expect(statusRepository.getOne).toHaveBeenCalledWith({
        id: params.statusId,
      });
      expect(projectRepository.getOne).toHaveBeenCalledWith({
        id: params.projectId,
      });
      expect(taskRepository.update).toHaveBeenCalledWith(
        { id: params.id },
        {
          title: params.title,
          text: params.text,
          startDate: undefined,
          endDate: params.endDate,
          statusId: params.statusId,
        },
      );
      expect(taskRepository.removeTaskFromProject).toHaveBeenCalledWith(
        params.id,
      );
      expect(taskRepository.addTaskToProject).toHaveBeenCalledWith(
        params.id,
        params.projectId,
        1,
      );
    });

    it('should throw an error if task is not found', async () => {
      const params: UpdateTaskUseCaseRequestDTO = {
        id: 'non_existent_task_id',
        title: 'Updated Title',
        text: 'Updated Text',
        endDate: new Date().toISOString(),
        statusId: 'existing_status_id',
        projectId: 'existing_project_id',
      };

      jest.spyOn(taskRepository, 'getOne').mockResolvedValueOnce(null);

      await expect(sut.execute(params)).rejects.toThrow(
        new NotFoundException('Task not found'),
      );
      expect(statusRepository.getOne).not.toHaveBeenCalled();
      expect(projectRepository.getOne).not.toHaveBeenCalled();
      expect(taskRepository.update).not.toHaveBeenCalled();
      expect(taskRepository.removeTaskFromProject).not.toHaveBeenCalled();
      expect(taskRepository.addTaskToProject).not.toHaveBeenCalled();
    });

    it('should throw an error if status is not found', async () => {
      const params: UpdateTaskUseCaseRequestDTO = {
        id: 'existing_task_id',
        title: 'Updated Title',
        text: 'Updated Text',
        endDate: new Date().toISOString(),
        statusId: 'non_existent_status_id',
        projectId: 'existing_project_id',
      };

      const existingTask = TaskFactory({
        id: params.id,
        title: 'Old Title',
        text: 'Old Text',
        startDate: null,
        endDate: null,
        statusId: 'old_status_id',
        ProjectTask: [
          {
            projectId: params.projectId,
            taskId: params.id,
            position: 1,
            Project: Object.create({}),
          },
        ],
      });

      jest.spyOn(taskRepository, 'getOne').mockResolvedValueOnce(existingTask);
      jest.spyOn(statusRepository, 'getOne').mockResolvedValueOnce(null);
      jest
        .spyOn(projectRepository, 'getOne')
        .mockResolvedValueOnce(ProjectFactory({ id: params.projectId }));

      await expect(sut.execute(params)).rejects.toThrow(
        new NotFoundException('Status not found'),
      );
      expect(taskRepository.update).not.toHaveBeenCalled();
      expect(taskRepository.removeTaskFromProject).not.toHaveBeenCalled();
      expect(taskRepository.addTaskToProject).not.toHaveBeenCalled();
    });

    it('should throw an error if project is not found', async () => {
      const params: UpdateTaskUseCaseRequestDTO = {
        id: 'existing_task_id',
        title: 'Updated Title',
        text: 'Updated Text',
        endDate: new Date().toISOString(),
        statusId: 'existing_status_id',
        projectId: 'non_existent_project_id',
      };

      const existingTask = TaskFactory({
        id: params.id,
        title: 'Old Title',
        text: 'Old Text',
        startDate: null,
        endDate: null,
        statusId: 'old_status_id',
        ProjectTask: [
          {
            projectId: params.projectId,
            taskId: params.id,
            position: 1,
            Project: Object.create({}),
          },
        ],
      });

      const status = StatusFactory({
        id: params.statusId,
        type: StatusTypeEnum.inprogress,
      });

      jest.spyOn(taskRepository, 'getOne').mockResolvedValueOnce(existingTask);
      jest.spyOn(statusRepository, 'getOne').mockResolvedValueOnce(status);
      jest.spyOn(projectRepository, 'getOne').mockResolvedValueOnce(null);

      await expect(sut.execute(params)).rejects.toThrow(
        new NotFoundException('Project ID not found'),
      );
      expect(taskRepository.update).not.toHaveBeenCalled();
      expect(taskRepository.removeTaskFromProject).not.toHaveBeenCalled();
      expect(taskRepository.addTaskToProject).not.toHaveBeenCalled();
    });
  });
});
