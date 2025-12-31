import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from 'src/DTOs/User.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateOrderDto } from 'src/DTOs/Order.dto';
import { Prisma, MenuItem } from '@prisma/client';

// import { CreateOrderDto, OrderItemDto } from './dto/create-order.dto';
// import { UpdateOrderStatusDto } from './dto/update-order.dto';
import { Order } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  // ================= USER REGISTRATION =================
  async createUser(data: CreateUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const defaultRole = await this.prisma.role.findUnique({
      where: { name: 'user' },
    });

    if (!defaultRole) {
      throw new NotFoundException('Default role not found');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        address: data.address,
        roleId: defaultRole.id,
      },
      include: { role: true },
    });

    return {
      message: 'User created successfully!',
      data: user,
    };
  }

  // ================= LOGIN =================
  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role.name,
    };

    const token = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET || 'supersecretkey',
      expiresIn: '1d',
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

  // ================= CREATE ORDER =================
  //   async createOrder(userId: number, data: CreateOrderDto) {
  //     const menuItem = await this.prisma.menuItem.findUnique({
  //       where: { id: data.menuItemId },
  //     });

  //     if (!menuItem) {
  //       throw new NotFoundException('Menu item not found');
  //     }

  //     if (!menuItem.isAvailable) {
  //       throw new BadRequestException('Item is not available');
  //     }

  //     const totalPrice = menuItem.price.times(data.quantity);
  //     // const totalPrice: Prisma.Decimal = menuItem.price.mul(data.quantity);

  //     const order = await this.prisma.order.create({
  //       data: {
  //         userId,
  //         status: OrderStatus.PENDING,
  //         totalPrice,
  //         items: {
  //           create: {
  //             menuItemId: menuItem.id,
  //             quantity: data.quantity,
  //             priceAtOrder: menuItem.price,
  //           },
  //         },
  //       },
  //       include: {
  //         items: {
  //           include: {
  //             menuItem: true,
  //           },
  //         },
  //         user: true,
  //       },
  //     });

  //     return {
  //       message: `${menuItem.name} ordered successfully`,
  //       order,
  //     };
  //   }
  // import { OrderStatus, Prisma } from '@prisma/client';

  // async createOrder(userId: number, data: CreateOrderDto) {
  //   const menuItem = await this.prisma.menuItem.findUnique({
  //     where: { id: data.menuItemId },
  //   });

  //   if (!menuItem) {
  //     throw new NotFoundException('Menu item not found');
  //   }

  //   if (!menuItem.isAvailable) {
  //     throw new BadRequestException('Item is not available');
  //   }

  //   const totalPrice: Prisma.Decimal = menuItem.price.mul(data.quantity);

  //   const order = await this.prisma.order.create({
  //     data: {
  //       userId,
  //       status: OrderStatus.PENDING,
  //       totalPrice,
  //       items: {
  //         create: {
  //           menuItemId: menuItem.id,
  //           quantity: data.quantity,
  //           priceAtOrder: menuItem.price,
  //         },
  //       },
  //     },
  //     include: {
  //       items: {
  //         include: { menuItem: true },
  //       },
  //       user: true,
  //     },
  //   });

  //   return {
  //     message: `${menuItem.name} ordered successfully`,
  //     order,
  //   };
  // }

  // ------------------- Create Order -------------------
  // async createOrder(dto: CreateOrderDto): Promise<Order> {
  //   // Validate user exists
  //   const user = await this.prisma.user.findUnique({
  //     where: { id: dto.userId },
  //   });
  //   if (!user) throw new NotFoundException('User not found');

  //   // Calculate total price
  //   let totalPrice = new Prisma.Decimal(0);
  //   const orderItemsData: Prisma.OrderItemCreateManyOrderInput[] = [];

  //   for (const item of dto.items) {
  //     const menuItem = await this.prisma.menuItem.findUnique({
  //       where: { id: item.menuItemId },
  //     });
  //     if (!menuItem)
  //       throw new NotFoundException(`Menu item ${item.menuItemId} not found`);

  //     totalPrice = totalPrice.add(menuItem.price.mul(item.quantity));

  //     orderItemsData.push({
  //       menuItemId: menuItem.id,
  //       quantity: item.quantity,
  //       priceAtOrder: menuItem.price,
  //     });
  //   }

  //   // Create order with items
  //   const order = await this.prisma.order.create({
  //     data: {
  //       userId: dto.userId,
  //       totalPrice,
  //       items: {
  //         create: orderItemsData,
  //       },
  //     },
  //     include: {
  //       items: { include: { menuItem: true } },
  //       user: true,
  //     },
  //   });

  //   return order;
  // }
  async createOrder(userId: number, dto: CreateOrderDto): Promise<Order> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    let totalPrice = new Prisma.Decimal(0);
    const orderItemsData: Prisma.OrderItemCreateManyOrderInput[] = [];

    for (const item of dto.items) {
      const menuItem = await this.prisma.menuItem.findUnique({
        where: { id: item.menuItemId },
      });

      if (!menuItem) {
        throw new NotFoundException(`Menu item ${item.menuItemId} not found`);
      }

      totalPrice = totalPrice.add(menuItem.price.mul(item.quantity));

      orderItemsData.push({
        menuItemId: menuItem.id,
        quantity: item.quantity,
        priceAtOrder: menuItem.price,
      });
    }

    return this.prisma.order.create({
      data: {
        userId,
        totalPrice,
        items: {
          create: orderItemsData,
        },
      },
      include: {
        items: { include: { menuItem: true } },
        user: true,
      },
    });
  }
  // ------------------- Get All Orders -------------------
  async getOrders(): Promise<Order[]> {
    return this.prisma.order.findMany({
      include: {
        user: true,
        items: { include: { menuItem: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ------------------- Get Order Details -------------------
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

  // ================= USER ORDERS =================
  async getUserOrders(userId: number) {
    return this.prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            menuItem: true,
          },
        },
        user: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ================= MENU ITEMS =================
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
}

// import {
//   BadRequestException,
//   ConflictException,
//   Injectable,
//   NotFoundException,
//   UnauthorizedException,
// } from '@nestjs/common';
// import { CreateUserDto } from 'src/DTOs/User.dto';
// import { PrismaService } from 'src/prisma/prisma.service';
// import * as bcrypt from 'bcrypt';
// import { JwtService } from '@nestjs/jwt';
// import { CreateOrderDto } from 'src/DTOs/Order.dto';
// import { MenuItem } from '@prisma/client';
// @Injectable()
// export class UserService {
//   constructor(
//     private prisma: PrismaService,
//     private jwtService: JwtService,
//   ) {}

//   async createUser(data: CreateUserDto) {
//     // check duplicate email
//     const existingUser = await this.prisma.user.findUnique({
//       where: { email: data.email },
//     });

//     if (existingUser) {
//       throw new ConflictException('Email already exists');
//     }

//     // assign default role (e.g., USER)
//     const defaultRole = await this.prisma.role.findUnique({
//       where: { name: 'USER' },
//     });

//     if (!defaultRole) {
//       throw new NotFoundException('Default role not found');
//     }

//     // hash password
//     const hashedPassword = await bcrypt.hash(data.password, 10);

//     // create user
//     const user = await this.prisma.user.create({
//       data: {
//         name: data.name,
//         email: data.email,
//         password: hashedPassword,
//         address: data.address,
//         roleId: defaultRole.id, // backend handles ID
//       },
//       include: { role: true }, // return role details
//     });

//     return {
//       message: 'User created successfully!',
//       data: user,
//     };
//   }

//   async login(email: string, password: string) {
//     const user = await this.prisma.user.findUnique({
//       where: {
//         email,
//       },
//       include: { role: true },
//     });
//     if (!user) {
//       throw new UnauthorizedException('Invalid credentials.');
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       throw new UnauthorizedException('Invalid Credentials');
//     }
//     const payload = {
//       sub: user.id,
//       email: user.email,
//       role: user.role.name,
//     };
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

//   async createOrder(userId: number, data: CreateOrderDto) {
//     // menuItem check
//     const menuItem = await this.prisma.menuItem.findUnique({
//       where: { id: data.menuItemId },
//     });

//     if (!menuItem) throw new NotFoundException('Menu item not found');
//     if (!menuItem.isAvailable)
//       throw new BadRequestException('Item is not available');

//     // const totalPrice = menuItem.price.mul(data.quantity);
//     const totalPrice = menuItem.price.times(data.quantity);

//     // create order + orderItem
//     const order = await this.prisma.order.create({
//       data: {
//         userId,
//         totalPrice,
//         status: 'PENDING',
//         orderItems: {
//           create: {
//             menuItemId: data.menuItemId,
//             quantity: data.quantity,
//             price: menuItem.price,
//           },
//         },
//       },
//       include: {
//         tems: { include: { menuItem: true } },
//         user: true,
//       },
//     });

//     return {
//       message: `${menuItem.name} is successfully ordered`,
//       order,
//     };
//   }

//   // User dashboard
//   async getUserOrders(userId: number) {
//     return this.prisma.order.findMany({
//       where: { userId },
//       include: {
//         items: { include: { menuItem: true } },
//         user: true,
//       },
//       orderBy: { createdAt: 'desc' },
//     });
//   }

//   async getMenuItems(category?: string): Promise<MenuItem[]> {
//     const whereClause: any = { isAvailable: true };

//     if (category) {
//       whereClause.category = {
//         name: { contains: category, mode: 'insensitive' },
//       };
//     }

//     return this.prisma.menuItem.findMany({
//       where: whereClause,
//       include: { category: true },
//       orderBy: { createdAt: 'desc' },
//     });
//   }
// }
