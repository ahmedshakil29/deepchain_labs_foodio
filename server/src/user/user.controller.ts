import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from 'src/DTOs/User.dto';
import { LoginDto } from 'src/DTOs/Login.dto';
import { CreateOrderDto } from 'src/DTOs/Order.dto';
import { UserGuard } from 'src/auth/userGuard';
import { MenuItem } from '@prisma/client';
import { Request } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('createuser')
  createUser(@Body() data: CreateUserDto) {
    return this.userService.createUser(data);
  }

  @Post('login')
  getlogin(@Body() logindata: LoginDto) {
    return this.userService.login(logindata.email, logindata.password);
  }

  // @Post('placeorder')
  // @UseGuards(UserGuard)
  // async placeOrder(
  //   @Body() data: CreateOrderDto,
  //   @Req() req: Request & { user: { sub: number } },
  // ) {
  //   // Make sure userId is typed as number
  //   const userId: number = req.user.sub;
  //   return this.userService.createOrder(userId, data);
  // }
  // user.controller.ts
  @Post('placeorder')
  @UseGuards(UserGuard)
  async placeOrder(
    @Body() data: CreateOrderDto,
    @Req() req: Request & { user: { sub: number } },
  ) {
    data.userId = req.user.sub; // inject current user into DTO
    return this.userService.createOrder(data); // only pass one argument
  }

  @Get('orders')
  @UseGuards(UserGuard)
  async getUserOrders(
    @Req() req: Request & { user: { sub: number } },
  ): Promise<any[]> {
    const userId: number = req.user.sub;
    return this.userService.getUserOrders(userId);
  }

  @Get('menu')
  getMenuItems(@Query('category') category?: string): Promise<MenuItem[]> {
    return this.userService.getMenuItems(category);
  }
}

// import {
//   Body,
//   Controller,
//   Get,
//   Post,
//   Query,
//   Req,
//   UseGuards,
// } from '@nestjs/common';
// import { UserService } from './user.service';
// import { CreateUserDto } from 'src/DTOs/User.dto';
// import { LoginDto } from 'src/DTOs/Login.dto';
// import { CreateOrderDto } from 'src/DTOs/Order.dto';
// import { UserGuard } from 'src/auth/userGuard';
// import { MenuItem } from '@prisma/client';

// @Controller('user')
// export class UserController {
//   constructor(private readonly userService: UserService) {}

//   @Post('createuser')
//   createUser(@Body() data: CreateUserDto) {
//     return this.userService.createUser(data);
//   }

//   @Post('login')
//   getlogin(@Body() logindata: LoginDto) {
//     return this.userService.login(logindata.email, logindata.password);
//   }

//   @Post('placeorder')
//   @UseGuards(UserGuard)
//   placeOrder(@Body() data: CreateOrderDto, @Req() req) {
//     const userId = req.user.sub; // JWT থেকে current user id
//     return this.userService.createOrder(userId, data);
//   }

//   @Get('orders')
//   @UseGuards(UserGuard)
//   getUserOrders(@Req() req): Promise<any[]> {
//     const userId = req.user.sub;
//     return this.userService.getUserOrders(userId);
//   }

//   @Get('menu')
//   getMenuItems(@Query('category') category?: string): Promise<MenuItem[]> {
//     return this.userService.getMenuItems(category);
//   }
// }
