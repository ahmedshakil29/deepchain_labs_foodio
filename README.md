# deepchain_Labs_foodio

Deepchain Labs Internship – Round 1: Technical Test Full Stack Assignment Project Title: Foodio - Restaurant Ordering System
project_name: Foodio – Restaurant Ordering System
purpose: Deepchain Labs Internship – Round 1 Technical Test

overview: >
Foodio is a full-stack restaurant ordering system that allows users to browse
menu categories, view menu items, place orders, and track order status.
It also includes an admin dashboard for managing categories, menu items,
and the order queue with role-based access control.

features:
public: - View menu categories - View menu items grouped by category - View menu item details (name, image, description, price)
user: - User authentication (Login / Signup) - Place orders - Backend price and availability validation - Track order status (Pending, Preparing, Ready, Completed) - View order history
admin: - Admin dashboard - Create, edit, delete categories - Create, edit, delete menu items - Set item availability - View all orders - Update order status

technology_stack:
frontend: - Next.js - TypeScript - Tailwind CSS
backend: - NestJS - TypeScript - PostgreSQL - Prisma ORM - JWT Authentication

authentication_and_roles:
user_role: - Browse menu - Place orders - Track own orders
admin_role: - Manage menu and categories - Manage orders and order status
security: - JWT-based authentication - Role-based access control - Protected admin routes

validation_and_security:

- Client-side validation
- Server-side validation using DTOs
- Order price validation on backend
- Menu availability checks

setup_instructions: >
The frontend and backend have separate setup instructions.
Please refer to the respective README files inside each project.

design_reference:

- Figma clickable prototype
- Figma UI screens
- Layout and structure strictly followed

author:
name: Shakil Ahmed
mobile: 01784285243
submission: Deepchain Labs Internship Assignment

license: >
This project is created for evaluation purposes only.
