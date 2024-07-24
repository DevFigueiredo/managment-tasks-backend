import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from './task.controller';
import { GetTaskUseCase } from '@src/modules/task/use-cases/get-tasks/get-task.use-case';
import { CreateTaskUseCase } from '@src/modules/task/use-cases/create-task/create-task.use-case';
import { UpdateTaskUseCase } from '@src/modules/task/use-cases/update-task/update-task.use-case';
import { GetDetailTaskUseCase } from '@src/modules/task/use-cases/get-detail-task/get-detail-task.use-case';
import { DeleteTaskUseCase } from '@src/modules/task/use-cases/delete-task/delete-task.use-case';
import { UpdatePositionTaskUseCase } from '@src/modules/task/use-cases/update-position-tasks/update-position-task.use-case';
import { UpdatePositionTaskUseCaseRequestDTO } from '@src/modules/task/use-cases/update-position-tasks/update-position-task.use-case.dto';
import {
  CreateTaskUseCaseRequestDTO,
  CreateTaskUseCaseResponseDTO,
} from '@src/modules/task/use-cases/create-task/create-task.use-case.dto';
import { UpdateTaskUseCaseRequestDTO } from '@src/modules/task/use-cases/update-task/update-task.use-case.dto';
import { GetDetailTaskUseCaseResponseDTO } from '@src/modules/task/use-cases/get-detail-task/get-detail-task.use-case.dto';
import { GetTaskUseCaseResponseDTO } from '@src/modules/task/use-cases/get-tasks/get-task.use-case.dto';
import { mock, MockProxy } from 'jest-mock-extended';
import { TaskFactory } from '@test/factories/task.factory';

describe('TaskController', () => {
  let sut: TaskController;
  const getTasksUseCase: MockProxy<GetTaskUseCase> = mock();
  const createTaskUseCase: MockProxy<CreateTaskUseCase> = mock();
  const updateTaskUseCase: MockProxy<UpdateTaskUseCase> = mock();
  const getDetailTaskUseCase: MockProxy<GetDetailTaskUseCase> = mock();
  const deleteTaskUseCase: MockProxy<DeleteTaskUseCase> = mock();
  const updatePositionTaskUseCase: MockProxy<UpdatePositionTaskUseCase> =
    mock();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [
        { provide: GetTaskUseCase, useValue: getTasksUseCase },
        { provide: CreateTaskUseCase, useValue: createTaskUseCase },
        { provide: UpdateTaskUseCase, useValue: updateTaskUseCase },
        { provide: GetDetailTaskUseCase, useValue: getDetailTaskUseCase },
        { provide: DeleteTaskUseCase, useValue: deleteTaskUseCase },
        {
          provide: UpdatePositionTaskUseCase,
          useValue: updatePositionTaskUseCase,
        },
      ],
    }).compile();

    sut = module.get<TaskController>(TaskController);
  });

  describe('updatePositions', () => {
    it('should call updatePositionTaskUseCase with correct parameters', async () => {
      const updatePositionDto: UpdatePositionTaskUseCaseRequestDTO = {
        tasks: [{ position: 1, taskId: 'task_id_1' }],
        projectId: 'project_id',
      };

      const spy = jest
        .spyOn(updatePositionTaskUseCase, 'execute')
        .mockResolvedValue(undefined);

      await sut.updatePositions(updatePositionDto);

      expect(spy).toHaveBeenCalledWith(updatePositionDto);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('get', () => {
    it('should return a list of tasks filtered by projectId', async () => {
      const projectId = '1';
      const tasks: GetTaskUseCaseResponseDTO[] = [TaskFactory(), TaskFactory()];

      jest.spyOn(getTasksUseCase, 'execute').mockResolvedValue(tasks);

      const result = await sut.get(projectId);

      expect(result).toEqual(tasks);
      expect(getTasksUseCase.execute).toHaveBeenCalledWith({ projectId });
      expect(getTasksUseCase.execute).toHaveBeenCalledTimes(1);
    });
  });

  describe('create', () => {
    it('should create a new task and return it', async () => {
      const createTaskDto: CreateTaskUseCaseRequestDTO = {
        projectId: 'any_projectId',
        text: 'any_text',
        title: 'any_title',
        endDate: 'any_endDate',
        statusId: 'any_statusId',
      };
      const createdTask: CreateTaskUseCaseResponseDTO = {
        id: '1',
      };

      jest.spyOn(createTaskUseCase, 'execute').mockResolvedValue(createdTask);

      const result = await sut.create(createTaskDto);

      expect(result).toEqual(createdTask);
      expect(createTaskUseCase.execute).toHaveBeenCalledWith(createTaskDto);
      expect(createTaskUseCase.execute).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    it('should update the task and return no content', async () => {
      const id = '1';
      const updateTaskDto: UpdateTaskUseCaseRequestDTO = {
        id: 'any_id',
        projectId: 'any_projectId',
        text: 'any_text',
        title: 'any_title',
        endDate: 'any_endDate',
        statusId: 'any_statusId',
      };

      const spy = jest
        .spyOn(updateTaskUseCase, 'execute')
        .mockResolvedValue(undefined);

      await sut.update(updateTaskDto, id);

      expect(spy).toHaveBeenCalledWith({ ...updateTaskDto, id });
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('getDetail', () => {
    it('should return task details for the given id', async () => {
      const id = '1';
      const taskDetail: GetDetailTaskUseCaseResponseDTO = TaskFactory();

      jest.spyOn(getDetailTaskUseCase, 'execute').mockResolvedValue(taskDetail);

      const result = await sut.getDetail(id);

      expect(result).toEqual(taskDetail);
      expect(getDetailTaskUseCase.execute).toHaveBeenCalledWith({ id });
      expect(getDetailTaskUseCase.execute).toHaveBeenCalledTimes(1);
    });
  });

  describe('delete', () => {
    it('should delete the task and return no content', async () => {
      const id = '1';

      const spy = jest
        .spyOn(deleteTaskUseCase, 'execute')
        .mockResolvedValue(undefined);

      await sut.delete(id);

      expect(spy).toHaveBeenCalledWith({ id });
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});
