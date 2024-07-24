import { PrismaClient } from '@prisma/client';
import { Module } from '@nestjs/common';

export const prisma = new PrismaClient({
  log: ['warn', 'error'],
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
