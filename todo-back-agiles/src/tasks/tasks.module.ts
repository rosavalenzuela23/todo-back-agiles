import { Module } from '@nestjs/common';
import { Task, TaskSchema } from './schemas/task.schema';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { AuthModule } from '../auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }]),
    AuthModule,
    TasksModule
  ],
  providers: [TasksService],
  controllers: [TasksController],
  exports: [TasksService, MongooseModule],
})
export class TasksModule {}
