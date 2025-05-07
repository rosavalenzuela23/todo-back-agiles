import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/schemas/user.schema';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
      ) {}
    
      /**
       * Metodo para validar un usuario de la base de datos.
       * @param email Email del usuario.
       * @param pass Contraseña del usuario.
       * @returns Objeto Usuario validado.
       */
      async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findByEmail(email);
        if (user && await bcrypt.compare(pass, user.password)) {
          const { password, ...result } = user.toObject();
          return result;
        }

        return null;
      }

      /**
       * Metodo para iniciar sesion.
       * @param loginDto Dto con validaciones para el login.
       * @returns Inicio de sesion.
       */
      async login(loginDto: LoginDto) {
        const user = await this.validateUser(loginDto.email, loginDto.password);
        if (!user) {
          throw new UnauthorizedException('Credenciales invalidas');
        }

        const payload = { email: user.email, username: user.username };
        return {
          acces_token: this.jwtService.sign(payload),
          user: {
            email: user.email,
            username: user.username
          }
        };
      }

      /**
       * Metodo para registrarse
       * @param registerDto Validaciones para el registro del usuario.
       * @returns Usuario registrado
       */
      async register(registerDto: RegisterDto): Promise<User> {
        const hashedPassword = await bcrypt.hash(registerDto.password, 10);
        const newUser = await this.usersService.create({
          ...registerDto,
          password: hashedPassword,
        });

        return newUser;
      }
}
