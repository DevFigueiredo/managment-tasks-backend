import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from '@shared/config/configuration';
import { TaskModule } from './modules/task/task.module';
import { ProjectModule } from './modules/project/project.module';
import { StatusModule } from './modules/status/status.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    ProjectModule,
    StatusModule,
    TaskModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
