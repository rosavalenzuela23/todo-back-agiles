import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { TasksModule } from './tasks/tasks.module';
import { AuthModule } from './auth/auth.module';


@Module({
  controllers: [AppController],
  imports: [
    ConfigModule.forRoot({ isGlobal: true}), // Para cargar el .env
    MongooseModule.forRoot('mongodb://localhost:27017/todo-app'),
    AuthModule,
    UsersModule,
    TasksModule
  ],
})
export class AppModule {}
