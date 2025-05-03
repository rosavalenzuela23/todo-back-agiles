import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './user/auth.module';
import { TasksModule } from './tasks/tasks.module';
import { ListsModule } from './lists/lists.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [AuthModule, TasksModule, ListsModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
