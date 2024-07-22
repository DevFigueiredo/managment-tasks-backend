import { Controller, Get, Query } from '@nestjs/common';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetStatusUseCase } from '@src/modules/status/use-cases/get-status/get-status.use-case';
import { GetStatusUseCaseResponseDTO } from '@src/modules/status/use-cases/get-status/get-status.use-case.dto';

@ApiTags('Status')
@Controller('status')
export class StatusController {
  constructor(private readonly getStatusUseCase: GetStatusUseCase) {}

  @Get()
  @ApiResponse({ type: GetStatusUseCaseResponseDTO, isArray: true })
  @ApiQuery({
    name: 'projectId',
    type: String,
    required: false,
    description: 'Filter statuses by project ID',
  })
  get(
    @Query('projectId') projectId?: string,
  ): Promise<GetStatusUseCaseResponseDTO[]> {
    return this.getStatusUseCase.execute({ projectId });
  }
}
