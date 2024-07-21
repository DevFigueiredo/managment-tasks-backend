import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Project (Projeto)')
@Controller('project')
export class ProjectController {
  constructor() {}

  @Get()
  create(): string {
    return '';
  }
}
