import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { JwtUserPayload } from '../auth/jwt-payload.interface';

@Injectable()
export class UserGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Token missing');
    }

    try {
      // const payload = await this.jwtService.verifyAsync<JwtUserPayload>(token, {
      //   secret: process.env.JWT_SECRET || 'supersecretkey',
      // });
      const payload = await this.jwtService.verifyAsync<JwtUserPayload>(token, {
        secret: process.env.JWT_SECRET || 'supersecretkey',
      });

      // ✅ Safe assignment (typed via express.d.ts)
      request.user = payload;

      if (payload.role !== 'user') {
        throw new UnauthorizedException('User access only');
      }

      return true;
    } catch (error) {
      console.error('UserGuard JWT Error:', error);
      throw new UnauthorizedException('Unauthorized access');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
