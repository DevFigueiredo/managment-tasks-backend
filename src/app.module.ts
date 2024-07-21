import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from 'shared/config/configuration';
import { TaskModule } from './modules/task/task.module';
import { ProjectModule } from './modules/project/project.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    TaskModule,
    ProjectModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
