import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { TasksModule } from './tasks/tasks.module';
import { AuthModule } from './auth/auth.module';
import { StaticModuleModule } from './static-module/static-module.module';


@Module({
  controllers: [AppController],
  imports: [
    ConfigModule.forRoot({ isGlobal: true}), // Para cargar el .env
    MongooseModule.forRoot('mongodb://localhost:27017/todo-app'),
    AuthModule,
    UsersModule,
    TasksModule,
    StaticModuleModule
  ],
})
export class AppModule {}
