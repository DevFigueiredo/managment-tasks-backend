import { PickType } from '@nestjs/swagger';
import { Task } from '@shared/domain/task';

export class DeleteTaskUseCaseRequestDTO extends PickType(Task, ['id']) {}
