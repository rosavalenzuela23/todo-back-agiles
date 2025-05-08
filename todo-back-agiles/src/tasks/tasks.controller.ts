import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  BadRequestException,
  Put,
  Patch,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task, Status } from './schemas/task.schema';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RequestWithTaskUser } from '../auth/interfaces/request-with-task.interface';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('tasks')
@Controller('tasks')
@UseGuards(JwtAuthGuard) // Aplicar el guard a nivel de controlador
@ApiBearerAuth() // Aplicar la documentación de autenticación a nivel de controlador
export class TasksController {
  constructor(private readonly tasksService: TasksService) { }

  @Post()
  @ApiOperation({ summary: 'Crear una nueva tarea' })
  @ApiResponse({ status: 201, description: 'Tarea creada exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async create(
    @Body() createTaskDto: CreateTaskDto,
    @Req() req: RequestWithTaskUser,
  ): Promise<Task> {
    return this.tasksService.create(createTaskDto, req.user.email as string);
  }

  @Get('category/:category')
  @ApiOperation({ summary: 'Obtener tareas por categoría del usuario actual' })
  @ApiResponse({ status: 200, description: 'Tareas filtradas por categoría' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async findAllUserByCategory(
    @Param('category') category: string,
    @Req() req: RequestWithTaskUser
  ): Promise<Task[]> {
    return this.tasksService.findAllByCategory(category, req.user.email as string);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las tareas del usuario actual' })
  @ApiResponse({ status: 200, description: 'Lista de tareas del usuario' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async findAllByUser(@Req() req: RequestWithTaskUser): Promise<Task[]> {
    return this.tasksService.findAllByUser(req.user.email as string);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar una tarea' })
  @ApiResponse({ status: 200, description: 'Tarea actualizada' })
  @ApiResponse({ status: 404, description: 'Tarea no encontrada' })
  async update(
    @Param('id') taskId: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @Req() req: RequestWithTaskUser,
  ): Promise<Task> {
    return this.tasksService.update(taskId, updateTaskDto, req.user.email as string);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una tarea' })
  @ApiResponse({ status: 200, description: 'Tarea eliminada' })
  @ApiResponse({ status: 404, description: 'Tarea no encontrada' })
  async remove(
    @Param('id') taskId: string,
    @Req() req: RequestWithTaskUser,
  ): Promise<void> {
    return this.tasksService.remove(taskId, req.user.email as string);
  }

  @Patch(':id/status')
async changeStatus(
  @Param('id') taskId: string,
  @Body('status') status: string, // Cambiar a string para validar
  @Req() req: RequestWithTaskUser,
): Promise<Task> {
  if (!Object.values(Status).includes(status as Status)) {
    throw new BadRequestException('Estado no válido');
  }
  return this.tasksService.changeStatus(taskId, status as Status, req.user.email as string);
}
}