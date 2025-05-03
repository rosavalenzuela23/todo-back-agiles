// src/auth/guards/jwt-auth.guard.ts
import {
    ExecutionContext,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
  import { AuthGuard } from '@nestjs/passport';
  import { Observable } from 'rxjs';
  
  @Injectable()
  export class JwtAuthGuard extends AuthGuard('jwt') {
    canActivate(
      context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
      return super.canActivate(context);
    }
  
    handleRequest(err: any, user: any, info: any) {
      if (err || !user) {
        throw err || new UnauthorizedException('No estás autorizado para acceder a este recurso');
      }
      return user;
    }
  }