import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import type { Request } from 'express';

@Controller('users')
export class UserController {
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Req() req: Request) {
    const user = req['user'] as {
      sub: number;
      role: 'ADMIN' | 'USER';
    };

    return {
      userId: user.sub,
      role: user.role,
    };
  }
}
