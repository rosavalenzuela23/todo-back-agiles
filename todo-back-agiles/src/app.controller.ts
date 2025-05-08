import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('hello') // <-- Prefijo de ruta
export class AppController {
  @Get()
  getHello(): string {
    return 'Hola desde NestJS';
  }


}
