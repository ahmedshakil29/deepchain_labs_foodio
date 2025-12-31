# 🍽️ Foodio Backend

A **NestJS REST API** for restaurant management built with **Prisma ORM** and **PostgreSQL**.  
Supports **role-based access (Admin & User)**, menu management, and order processing.

---

## 🚀 Tech Stack

- NestJS
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Bcrypt

---

## ✨ Core Features

### Public

- View menu & categories

### User (Authenticated)

- Register & login
- Place orders
- View order history
- Track order status

### Admin

- Manage users & roles
- CRUD categories & menu items
- Upload menu images
- View & update all orders

---

## 🧱 Main Entities

- **User** → belongs to a **Role**
- **Category** → has many **MenuItems**
- **Order** → belongs to a **User**
- **OrderItem** → connects Order & MenuItem

## ⚙️ Setup & Run

### 1️⃣ Clone & install

```bash
git clone <repo-url>
cd foodio_backend
npm install


2️⃣ Environment variables
Create .env file:
DATABASE_URL="postgresql://username:password@localhost:5432/foodio_db"
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="7d"
PORT=3000


3️⃣ Database setup
npx prisma migrate dev
npx prisma generate

4️⃣ Run the server

npm run start:dev

Server will run at:
http://localhost:3001

🔐 Authentication

JWT-based authentication

Use header:

Authorization: Bearer <token>
Roles

Public – No token

User – JWT required

Admin – JWT + Admin role


📄 License

MIT License
```
