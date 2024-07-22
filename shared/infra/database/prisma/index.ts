import { PrismaClient } from '@prisma/client';
import { Module } from '@nestjs/common';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn'],
});
@Module({
  imports: [],
  controllers: [],
  providers: [
    {
      provide: 'db',
      useValue: prisma,
    },
  ],
  exports: [
    {
      provide: 'db',
      useValue: prisma,
    },
  ],
})
export class DatabaseModule {}
