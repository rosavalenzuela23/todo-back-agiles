import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Req, } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
//import { JwtAuthGuard } from '../auth/guards/jwt_auth.guard';

@Controller('tasks')
export class TasksController {}
