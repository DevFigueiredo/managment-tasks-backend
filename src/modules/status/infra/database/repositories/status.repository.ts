import { Inject, Injectable } from '@nestjs/common';
import { IStatusRepository } from './interfaces/status.repository-interface';
import { PrismaClient } from '@prisma/client';
import { Status } from '@shared/domain/status';

@Injectable()
export class StatusRepository implements IStatusRepository.Repository {
  constructor(@Inject('db') private readonly db: PrismaClient) {}

  async get(params: IStatusRepository.GetParams): Promise<Status[]> {
    return this.db.status.findMany({
      where: {
        projectId: params.projectId,
      },
    });
  }
}
