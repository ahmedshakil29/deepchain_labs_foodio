# Foodio – Frontend (Client)

# Overview:

This is the frontend application for the Foodio Restaurant Ordering System.
It is built using Next.js, TypeScript, and Tailwind CSS, and handles
user authentication, menu browsing, order placement, order tracking,
and admin dashboard UI.

# Features:

public: - Homepage with menu categories - Menu items grouped by category - Menu item details page
authenticated_user: - Login and Signup - Place orders - View order history - Track order status
admin: - Admin dashboard UI - Manage categories - Manage menu items - View and update orders

# Technology Stack:

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- React Query
- Axios
- React Hook Form
- Zod
- Cloudinary

# Setup and Run:

steps: - Install dependencies using npm install - Create environment file .env.local - Set NEXT_PUBLIC_API_BASE_URL to backend URL - Run development server using npm run dev

### Installation

1.  Clone the repository to your local machine:

    ```bash
    git clone https://github.com/ahmedshakil29/deepchain_labs_foodio
    ```

2.  Navigate into the project directory:

    ```bash
    cd client
    ```

3.  Install the dependencies using npm:
    ```bash
    npm install
    ```

development_server:
url: http://localhost:3000

environment_variables:

NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_URL=http://localhost:3000

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME = YOUR_CLOUDINARY_CLOUD_NAME

NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET= CLOUDINARY_UPLOAD_PRESET

authentication:

- JWT-based authentication
- Secure token handling
- Admin routes protected by role checks

validation:

- Client-side form validation using Zod
- Backend validation errors handled gracefully

ui_and_design:

- Responsive layout
- Tailwind CSS utility-first styling
- Implemented according to provided Figma design

notes:

- Backend server must be running before using the application
- Admin access requires admin role from backend

## Getting Started

First, run the development server:

```bash
npm run dev

```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

# Author:

name: Shakil Ahmed
mobile: 01784285243
submission: Deepchain Labs Internship Assignment
