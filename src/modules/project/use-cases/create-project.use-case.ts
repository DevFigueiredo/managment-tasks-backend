import { Injectable } from '@nestjs/common';

@Injectable()
export class CreateTaskUseCase {
  execute(): string {
    return 'Hello World!';
  }
}
