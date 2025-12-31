import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateRoleDto } from 'src/DTOs/Role.dto';
import { CreateUserDto } from 'src/DTOs/User.dto';
import { LoginDto } from 'src/DTOs/Login.dto';
import { AdminGuard } from 'src/auth/adminguard';
import { CreateCategoryDto } from 'src/DTOs/Catagory.dto';
import { Category, MenuItem } from '@prisma/client';
import { CreateMenuItemDto, UpdateMenuItemDto } from 'src/DTOs/MenuItem.dto';
import { UpdateOrderStatusDto } from 'src/DTOs/Order.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // Roles
  @Post('roles')
  @UseGuards(AdminGuard)
  createRole(@Body() data: CreateRoleDto) {
    return this.adminService.createRole(data);
  }

  // Users
  @Post('createuser')
  createUser(@Body() data: CreateUserDto) {
    return this.adminService.createUser(data);
  }

  @Post('login')
  getlogin(@Body() logindata: LoginDto) {
    return this.adminService.login(logindata.email, logindata.password);
  }

  // Categories
  @Post('createcategory')
  @UseGuards(AdminGuard)
  createCategory(
    @Body() data: CreateCategoryDto,
  ): Promise<{ message: string; data: Category }> {
    return this.adminService.createCategory(data);
  }

  @Get('categories')
  @UseGuards(AdminGuard)
  async getAllCategories() {
    return this.adminService.getAllCategories();
  }

  @Delete('deletecategory/:id')
  @UseGuards(AdminGuard)
  deleteCategory(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.deleteCategory(id);
  }

  // Menu Items
  @Post('createmenuitem')
  @UseGuards(AdminGuard)
  createMenuItem(@Body() data: CreateMenuItemDto) {
    return this.adminService.createMenuItem(data);
  }

  @Patch('updatemenuitem/:id')
  @UseGuards(AdminGuard)
  async updateMenuItem(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateMenuItemDto,
  ) {
    return this.adminService.updateMenuItem(id, data);
  }

  @Delete('menuitem/:id')
  @UseGuards(AdminGuard)
  async deleteMenuItem(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    return this.adminService.deleteMenuItem(id);
  }

  @Get('menu')
  getMenuItems(@Query('category') category?: string): Promise<MenuItem[]> {
    return this.adminService.getMenuItems(category);
  }

  // Orders
  @Get('orders')
  @UseGuards(AdminGuard)
  getOrders() {
    return this.adminService.getOrders();
  }

  @Get('order/:id')
  @UseGuards(AdminGuard)
  getOrderDetails(@Param('id', ParseIntPipe) id: number): Promise<any> {
    return this.adminService.getOrderDetails(id);
  }

  @Patch('order/status/:id')
  @UseGuards(AdminGuard)
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateOrderStatusDto,
  ): Promise<any> {
    return this.adminService.updateOrderStatus(id, data.status);
  }
}
