import { PrismaClient, OrderStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ---------------- Roles ----------------
  const adminRole = await prisma.role.upsert({
    where: { name: 'admin' },
    update: {},
    create: { name: 'admin', description: 'System Administrator' },
  });

  const userRole = await prisma.role.upsert({
    where: { name: 'user' },
    update: {},
    create: { name: 'user', description: 'Regular User' },
  });

  // ---------------- Users ----------------
  const adminPassword = await bcrypt.hash('Admin@123', 10);
  const userPassword = await bcrypt.hash('User@123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@foodio.com' },
    update: {},
    create: {
      name: 'Super Admin',
      email: 'admin@foodio.com',
      password: adminPassword,
      address: 'Admin Address',
      roleId: adminRole.id,
    },
  });

  const user = await prisma.user.upsert({
    where: { email: 'user@foodio.com' },
    update: {},
    create: {
      name: 'Demo User',
      email: 'user@foodio.com',
      password: userPassword,
      address: 'User Address',
      roleId: userRole.id,
    },
  });

  // ---------------- Categories ----------------
  const pizzaCategory = await prisma.category.upsert({
    where: { name: 'Pizza' },
    update: {},
    create: { name: 'Pizza' },
  });

  const burgerCategory = await prisma.category.upsert({
    where: { name: 'Burger' },
    update: {},
    create: { name: 'Burger' },
  });

  // ---------------- Menu Items ----------------
  const margherita = await prisma.menuItem.create({
    data: {
      name: 'Margherita Pizza',
      description: 'Classic cheese pizza',
      price: 8.99,
      categoryId: pizzaCategory.id,
      isAvailable: true,
    },
  });

  const cheeseburger = await prisma.menuItem.create({
    data: {
      name: 'Cheese Burger',
      description: 'Beef burger with cheese',
      price: 5.49,
      categoryId: burgerCategory.id,
      isAvailable: true,
    },
  });

  // ---------------- Orders ----------------
  const order = await prisma.order.create({
    data: {
      userId: user.id,
      status: OrderStatus.PENDING,
      totalPrice: 8.99 * 2 + 5.49,
    },
  });

  // ---------------- Order Items ----------------
  await prisma.orderItem.createMany({
    data: [
      {
        orderId: order.id,
        menuItemId: margherita.id,
        quantity: 2,
        priceAtOrder: margherita.price,
      },
      {
        orderId: order.id,
        menuItemId: cheeseburger.id,
        quantity: 1,
        priceAtOrder: cheeseburger.price,
      },
    ],
  });

  console.log('✅ Database seeded successfully');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

// import { PrismaClient } from '@prisma/client';
// import * as bcrypt from 'bcrypt';

// const prisma = new PrismaClient();

// async function main() {
//   // Upsert roles
//   const adminRole = await prisma.role.upsert({
//     where: { name: 'admin' }, // lowercase to match AdminService
//     update: {},
//     create: {
//       name: 'admin',
//       description: 'System Administrator',
//     },
//   });

//   const userRole = await prisma.role.upsert({
//     where: { name: 'user' },
//     update: {},
//     create: {n
//       name: 'user',
//       description: 'Regular User',
//     },
//   });

//   // Hash password for admin
//   const hashedPassword = await bcrypt.hash('Admin@123', 10);

//   // Upsert Super Admin user
//   await prisma.user.upsert({
//     where: { email: 'admin@foodio.com' },
//     update: {},
//     create: {
//       name: 'Super Admin',
//       email: 'admin@foodio.com',
//       password: hashedPassword,
//       address: 'Admin Address',
//       roleId: adminRole.id,
//       imageUrl: null, // optional
//     },
//   });

//   console.log('✅ Roles & Super Admin seeded successfully');
// }

// main()
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });
