import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  UseGuards,
  Req,
  Patch,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RequestWithUser } from '../auth/interfaces/request-with-user.interface';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  @ApiOperation({ summary: 'Registrar nuevo usuario' })
  @ApiResponse({ status: 201, description: 'Usuario creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 409, description: 'El email ya está registrado' })
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Obtener información del usuario actual' })
  @ApiResponse({ status: 200, description: 'Información del usuario' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async getCurrentUser(@Req() req: RequestWithUser) {
    return this.usersService.findByEmail(req.user.email as string);
  }

  @Get('all')
  @ApiOperation({ summary: 'Obtener todos los usuarios' })
  @ApiResponse({ status: 200, description: 'Información del usuario' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async getAll(@Req() req: RequestWithUser) {
    return this.usersService.findAll();
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Actualizar información del usuario actual' })
  @ApiResponse({ status: 200, description: 'Usuario actualizado' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async updateCurrentUser(
    @Req() req: RequestWithUser,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(req.user.email as string, updateUserDto);
  }

  @Delete('me')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Eliminar cuenta de usuario actual' })
  @ApiResponse({ status: 200, description: 'Usuario eliminado' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async deleteCurrentUser(@Req() req: RequestWithUser) {
    return this.usersService.remove(req.user.email as string);
  }

  // Endpoint adicional para obtener tareas del usuario
  @Get('me/tasks')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Obtener todas las tareas del usuario' })
  @ApiResponse({ status: 200, description: 'Lista de tareas' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async getUserTasks(@Req() req: RequestWithUser) {
    return this.usersService.getUserWithTasks(req.user.email as string);
  }
}
