import { PickType } from '@nestjs/swagger';
import { Task } from '@shared/domain/task';

export class GetDetailTaskUseCaseRequestDTO extends PickType(Task, ['id']) {}
export class GetDetailTaskUseCaseResponseDTO extends Task {}
