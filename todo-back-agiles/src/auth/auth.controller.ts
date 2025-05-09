import { Controller, Post, Body, Request, UnauthorizedException, HttpCode  } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('register')
    @ApiOperation({ summary: 'Registrar un nuevo usuario' })
    @ApiResponse({ status: 201, description: 'Usuario regustrado exitosamente' })
    @ApiResponse({ status: 400, description: 'Datos de registro invalidos' })
    async register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }

    @Post('login')
    @HttpCode(200)
    @ApiOperation({ summary: 'Iniciar sesion' })
    @ApiResponse({ status: 200, description: 'Inicio de sesion exitoso' })
    @ApiResponse({ status: 401, description: 'Credenciales invalidas' })
    async login(@Body() loginDto: LoginDto, @Request() req) {

        return this.authService.login(loginDto);
    }
}
