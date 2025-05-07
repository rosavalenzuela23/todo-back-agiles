import { Controller, Post, Body, Request, UnauthorizedException } from '@nestjs/common';
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
    @ApiOperation({ summary: 'Iniciar sesion' })
    @ApiResponse({ status: 200, description: 'Inicio de sesion exitoso' })
    @ApiResponse({ status: 401, description: 'Credenciales invalidas' })
    async login(@Body() loginDto: LoginDto, @Request() req) {
        const user = await this.authService.validateUser(loginDto.email, loginDto.password);
        if (!user) {
            throw new UnauthorizedException('Credenciales invalidas');
        }

        return this.authService.login(user);
    }
}
