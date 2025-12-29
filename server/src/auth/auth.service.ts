import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Role } from '../generated/prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(dto: RegisterDto) {
    const existingUser = await this.userService.getUserByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.userService.createUser(
      dto.name,
      dto.email,
      hashedPassword,
      Role.USER, // ✅ Prisma enum
    );

    return this.generateToken(user.id, user.role);
  }

  async login(dto: LoginDto) {
    const user = await this.userService.getUserByEmail(dto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateToken(user.id, user.role);
  }

  private async generateToken(userId: number, role: Role) {
    const payload = { sub: userId, role };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
