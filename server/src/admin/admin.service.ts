import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/DTOs//User.dto';
import { UpdateUserDto } from 'src/DTOs//User.dto';
import { CreateRoleDto } from 'src/DTOs/Role.dto';
import { CreateCategoryDto } from 'src/DTOs/Catagory.dto';
import { CreateMenuItemDto, UpdateMenuItemDto } from 'src/DTOs/MenuItem.dto';
import {
  Prisma,
  Role,
  Category,
  MenuItem,
  Order,
  OrderStatus,
} from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  // ------------------- Role -------------------
  async createRole(data: CreateRoleDto): Promise<Role> {
    const existing = await this.prisma.role.findUnique({
      where: { name: data.name },
    });
    if (existing) throw new ConflictException('Role already exists');

    return this.prisma.role.create({ data });
  }

  async getRoles(): Promise<Role[]> {
    return this.prisma.role.findMany();
  }

  // ------------------- User -------------------
  async createUser(data: CreateUserDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existing) throw new ConflictException('Email already exists');

    const defaultRole = await this.prisma.role.findUnique({
      where: { name: 'admin' },
    });
    if (!defaultRole) throw new NotFoundException('Default role not found');

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        address: data.address,
        roleId: defaultRole.id,
        imageUrl: data.imageUrl ?? null,
      },
      include: { role: true },
    });

    return { message: 'User created successfully!', data: user };
  }

  async updateUser(userId: number, data: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    let hashedPassword: string | undefined;
    if (data.password) {
      hashedPassword = await bcrypt.hash(data.password, 10);
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name ?? undefined,
        email: data.email ?? undefined,
        password: hashedPassword ?? undefined,
        address: data.address ?? undefined,
        imageUrl: data.imageUrl ?? undefined,
      },
      include: { role: true },
    });

    return { message: 'User updated successfully!', data: updatedUser };
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    const payload = { sub: user.id, email: user.email, role: user.role.name };
    const token = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET || 'supersecretkey',
    });

    return {
      status: 'success',
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role.name,
      },
    };
  }

  // ------------------- Category -------------------
  async createCategory(
    data: CreateCategoryDto,
  ): Promise<{ message: string; data: Category }> {
    const existing = await this.prisma.category.findUnique({
      where: { name: data.name },
    });
    if (existing) throw new ConflictException('Category already exists');

    const category = await this.prisma.category.create({
      data: { name: data.name },
    });
    return { message: 'Category created successfully!', data: category };
  }

  async getAllCategories(): Promise<Category[]> {
    return this.prisma.category.findMany();
  }

  async deleteCategory(id: number) {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) throw new NotFoundException('Category not found');

    await this.prisma.category.delete({ where: { id } });
    return { message: 'Category deleted successfully!' };
  }

  // ------------------- MenuItem -------------------
  async createMenuItem(
    data: CreateMenuItemDto,
  ): Promise<{ message: string; data: MenuItem }> {
    const category = await this.prisma.category.findUnique({
      where: { name: data.categoryName },
    });
    if (!category) throw new NotFoundException('Category not found');

    const menuItem = await this.prisma.menuItem.create({
      data: {
        name: data.name,
        description: data.description,
        price: new Prisma.Decimal(data.price),
        categoryId: category.id,
        imageUrl: data.imageUrl ?? null,
        isAvailable: true,
      },
      include: { category: true },
    });

    return { message: 'Menu item created successfully!', data: menuItem };
  }

  async updateMenuItem(
    id: number,
    data: UpdateMenuItemDto,
  ): Promise<{ message: string; data: MenuItem }> {
    const menuItem = await this.prisma.menuItem.findUnique({ where: { id } });
    if (!menuItem) throw new NotFoundException('Menu item not found');

    let categoryId = menuItem.categoryId;
    if (data.categoryName) {
      const category = await this.prisma.category.findUnique({
        where: { name: data.categoryName },
      });
      if (!category) throw new NotFoundException('Category not found');
      categoryId = category.id;
    }

    const updated = await this.prisma.menuItem.update({
      where: { id },
      data: {
        name: data.name ?? undefined,
        description: data.description ?? undefined,
        price:
          data.price !== undefined ? new Prisma.Decimal(data.price) : undefined,
        categoryId,
        imageUrl: data.imageUrl ?? undefined,
        isAvailable: data.isAvailable ?? menuItem.isAvailable,
      },
      include: { category: true },
    });

    return { message: 'Menu item updated successfully!', data: updated };
  }

  async deleteMenuItem(id: number): Promise<{ message: string }> {
    const menuItem = await this.prisma.menuItem.findUnique({ where: { id } });
    if (!menuItem) throw new NotFoundException('Menu item not found');

    await this.prisma.menuItem.delete({ where: { id } });
    return { message: 'Menu item deleted successfully!' };
  }

  async getMenuItems(category?: string): Promise<MenuItem[]> {
    const whereClause: Prisma.MenuItemWhereInput = {};
    if (category) {
      whereClause.category = {
        name: { equals: category, mode: 'insensitive' },
      };
    }

    return this.prisma.menuItem.findMany({
      where: whereClause,
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ------------------- Orders -------------------
  async getOrders(): Promise<Order[]> {
    return this.prisma.order.findMany({
      include: { user: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getOrderDetails(orderId: number) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: true,
        items: { include: { menuItem: true } },
      },
    });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async updateOrderStatus(orderId: number, status: OrderStatus) {
    const order = await this.prisma.order.update({
      where: { id: orderId },
      data: { status },
      include: { user: true, items: { include: { menuItem: true } } },
    });
    if (!order) throw new NotFoundException('Order not found');
    return { message: 'Status updated successfully', order };
  }
}

// import {
//   ConflictException,
//   Injectable,
//   NotFoundException,
//   UnauthorizedException,
// } from '@nestjs/common';
// import { PrismaService } from 'src/prisma/prisma.service';
// import { JwtService } from '@nestjs/jwt';
// import * as bcrypt from 'bcrypt';
// import { Prisma } from '@prisma/client';
// import { CreateRoleDto } from 'src/DTOs/Role.dto';
// import { CreateUserDto, UpdateUserDto } from 'src/DTOs/User.dto';
// import { CreateCategoryDto } from 'src/DTOs/Catagory.dto';
// import { CreateMenuItemDto, UpdateMenuItemDto } from 'src/DTOs/MenuItem.dto';

// @Injectable()
// export class AdminService {
//   constructor(
//     private prisma: PrismaService,
//     private jwtService: JwtService,
//   ) {}

//   // -------------------- Role --------------------
//   async createRole(data: CreateRoleDto) {
//     const existing = await this.prisma.role.findUnique({
//       where: { name: data.name },
//     });
//     if (existing) throw new ConflictException('Role already exists');

//     return this.prisma.role.create({ data });
//   }

//   async getAllRoles() {
//     return this.prisma.role.findMany({ orderBy: { createdAt: 'asc' } });
//   }

//   async deleteRole(id: number) {
//     const role = await this.prisma.role.findUnique({ where: { id } });
//     if (!role) throw new NotFoundException('Role not found');

//     await this.prisma.role.delete({ where: { id } });
//     return { message: 'Role deleted successfully' };
//   }

//   // -------------------- User --------------------
//   // -------------------- Create User --------------------
//   async createUser(data: CreateUserDto) {
//     // Check for duplicate email
//     const existingUser = await this.prisma.user.findUnique({
//       where: { email: data.email },
//     });
//     if (existingUser) throw new ConflictException('Email already exists');

//     // Assign default role (admin)
//     const defaultRole = await this.prisma.role.findUnique({
//       where: { name: 'admin' },
//     });
//     if (!defaultRole) throw new NotFoundException('Default role not found');

//     // Hash password
//     const hashedPassword = await bcrypt.hash(data.password, 10);

//     // Create user
//     const user = await this.prisma.user.create({
//       data: {
//         name: data.name,
//         email: data.email,
//         password: hashedPassword,
//         address: data.address, // required field
//         roleId: defaultRole.id,
//         imageUrl: data.imageUrl ?? null,
//       },
//       include: { role: true },
//     });

//     return { message: 'User created successfully!', data: user };
//   }

//   // -------------------- Update User --------------------
//   // async updateUser(userId: number, data: UpdateUserDto) {
//   //   const user = await this.prisma.user.findUnique({ where: { id: userId } });
//   //   if (!user) throw new NotFoundException('User not found');

//   //   // Hash password if updating
//   //   let hashedPassword: string | undefined;
//   //   if (data.password) {
//   //     hashedPassword = await bcrypt.hash(data.password, 10);
//   //   }

//   //   const updatedUser = await this.prisma.user.update({
//   //     where: { id: userId },
//   //     data: {
//   //       name: data.name ?? user.name,
//   //       email: data.email ?? user.email,
//   //       password: hashedPassword ?? user.password,
//   //       address: data.address ?? user.address,
//   //       imageUrl: data.imageUrl ?? user.imageUrl,
//   //     },
//   //     include: { role: true },
//   //   });

//   //   return { message: 'User updated successfully!', data: updatedUser };
//   // }
//   async updateUser(userId: number, data: UpdateUserDto) {
//     const user = await this.prisma.user.findUnique({ where: { id: userId } });
//     if (!user) throw new NotFoundException('User not found');

//     let hashedPassword: string | undefined;
//     if (data.password) {
//       hashedPassword = await bcrypt.hash(data.password, 10);
//     }

//     const updatedUser = await this.prisma.user.update({
//       where: { id: userId },
//       data: {
//         name: data.name ?? undefined,
//         email: data.email ?? undefined,
//         password: hashedPassword ?? undefined,
//         address: data.address ?? undefined,
//         imageUrl: data.imageUrl ?? undefined,
//       },
//       include: { role: true },
//     });

//     return { message: 'User updated successfully!', data: updatedUser };
//   }

//   async login(email: string, password: string) {
//     const user = await this.prisma.user.findUnique({
//       where: { email },
//       include: { role: true },
//     });
//     if (!user) throw new UnauthorizedException('Invalid credentials');

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) throw new UnauthorizedException('Invalid credentials');

//     const payload = { sub: user.id, email: user.email, role: user.role.name };
//     const token = await this.jwtService.signAsync(payload, {
//       secret: process.env.JWT_SECRET || 'supersecretkey',
//       expiresIn: '1d',
//     });

//     return {
//       status: 'success',
//       message: 'Login successful',
//       token,
//       user: {
//         id: user.id,
//         name: user.name,
//         email: user.email,
//         role: user.role.name,
//       },
//     };
//   }

//   async getAllUsers() {
//     return this.prisma.user.findMany({
//       include: { role: true },
//       orderBy: { createdAt: 'desc' },
//     });
//   }

//   async deleteUser(id: number) {
//     const user = await this.prisma.user.findUnique({ where: { id } });
//     if (!user) throw new NotFoundException('User not found');

//     await this.prisma.user.delete({ where: { id } });
//     return { message: 'User deleted successfully' };
//   }

//   // -------------------- Category --------------------
//   async createCategory(data: CreateCategoryDto) {
//     const existing = await this.prisma.category.findUnique({
//       where: { name: data.name },
//     });
//     if (existing) throw new ConflictException('Category already exists');

//     const category = await this.prisma.category.create({ data });
//     return { message: 'Category created successfully!', data: category };
//   }

//   async getAllCategory() {
//     return this.prisma.category.findMany({ orderBy: { createdAt: 'desc' } });
//   }

//   async deleteCategory(id: number) {
//     const category = await this.prisma.category.findUnique({ where: { id } });
//     if (!category) throw new NotFoundException('Category not found');

//     await this.prisma.category.delete({ where: { id } });
//     return { message: 'Category deleted successfully' };
//   }

//   // -------------------- MenuItem --------------------
//   async createMenuItem(data: CreateMenuItemDto) {
//     const category = await this.prisma.category.findUnique({
//       where: { name: data.categoryName },
//     });
//     if (!category) throw new NotFoundException('Category not found');

//     const menuItem = await this.prisma.menuItem.create({
//       data: {
//         name: data.name,
//         description: data.description,
//         price: new Prisma.Decimal(data.price),
//         categoryId: category.id,
//         imageUrl: data.imageUrl ?? null,
//         isAvailable: data.isAvailable ?? true,
//       },
//       include: { category: true },
//     });

//     return { message: 'Menu item created successfully!', data: menuItem };
//   }

//   async updateMenuItem(id: number, data: UpdateMenuItemDto) {
//     const menuItem = await this.prisma.menuItem.findUnique({ where: { id } });
//     if (!menuItem) throw new NotFoundException('Menu item not found');

//     let categoryId = menuItem.categoryId;
//     if (data.categoryName) {
//       const category = await this.prisma.category.findUnique({
//         where: { name: data.categoryName },
//       });
//       if (!category) throw new NotFoundException('Category not found');
//       categoryId = category.id;
//     }

//     const updated = await this.prisma.menuItem.update({
//       where: { id },
//       data: {
//         name: data.name ?? menuItem.name,
//         description: data.description ?? menuItem.description,
//         price:
//           data.price !== undefined
//             ? new Prisma.Decimal(data.price)
//             : menuItem.price,
//         categoryId,
//         imageUrl: data.imageUrl ?? menuItem.imageUrl,
//         isAvailable: data.isAvailable ?? menuItem.isAvailable,
//       },
//       include: { category: true },
//     });

//     return { message: 'Menu item updated successfully!', data: updated };
//   }

//   async deleteMenuItem(id: number) {
//     const menuItem = await this.prisma.menuItem.findUnique({ where: { id } });
//     if (!menuItem) throw new NotFoundException('Menu item not found');

//     await this.prisma.menuItem.delete({ where: { id } });
//     return { message: 'Menu item deleted successfully!' };
//   }

//   async getMenuItems(category?: string) {
//     const whereClause: any = {};
//     if (category) {
//       whereClause.category = {
//         name: { equals: category, mode: 'insensitive' },
//       };
//     }

//     return this.prisma.menuItem.findMany({
//       where: whereClause,
//       include: { category: true },
//       orderBy: { createdAt: 'desc' },
//     });
//   }

//   // -------------------- Orders --------------------
//   async getOrders() {
//     return this.prisma.order.findMany({
//       include: { user: true },
//       orderBy: { createdAt: 'desc' },
//     });
//   }

//   async getOrderDetails(orderId: number) {
//     const order = await this.prisma.order.findUnique({
//       where: { id: orderId },
//       include: { user: true, orderItems: { include: { menuItem: true } } },
//     });

//     if (!order) throw new NotFoundException('Order not found');
//     return order;
//   }

//   async updateOrderStatus(orderId: number, status: string) {
//     const order = await this.prisma.order.update({
//       where: { id: orderId },
//       data: { status },
//       include: { user: true, orderItems: { include: { menuItem: true } } },
//     });

//     if (!order) throw new NotFoundException('Order not found');
//     return { message: 'Status updated successfully', order };
//   }
// }
