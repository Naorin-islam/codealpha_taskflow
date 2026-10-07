# TaskFlow

TaskFlow is a complete, modern, professional, production-style project management application designed for team collaboration. It is structured as an independently deployable frontend and backend architecture using Next.js for both.

## Features

- **Authentication**: Secure JWT-based authentication using bcrypt.
- **Projects**: Create, manage, and delete projects.
- **Kanban Board**: Drag-and-drop task management.
- **Real-Time Ready**: Built with Next.js and Prisma, ready for WebSocket integration.
- **Role-Based Access**: Owner, Admin, Member, and Viewer permissions.
- **Comments & Notifications**: Team communication capabilities.

## Architecture

TaskFlow uses a decoupled frontend and backend:

```text
TaskFlow/
├── backendtaskflow/    (Next.js API Routes, Prisma, PostgreSQL, JWT Auth)
└── frontendtaskflow/   (Next.js App Router, Tailwind CSS, shadcn/ui, Axios)
```

## Tech Stack

### Frontend
- Next.js 14+ (App Router)
- React, TypeScript
- Tailwind CSS, shadcn/ui
- dnd-kit (Drag & Drop)
- React Hook Form, Zod
- Axios

### Backend
- Next.js (API Routes only)
- TypeScript
- Prisma ORM
- PostgreSQL
- jsonwebtoken, bcrypt

---

## 🚀 Setup Instructions

### 1. PostgreSQL Setup

You must have PostgreSQL installed locally (e.g., via pgAdmin 4 or Docker).
1. Open pgAdmin or `psql`.
2. Create a new database named `taskflow`.
3. Note your postgres username and password.

### 2. Environment Variables

**Backend (`backendtaskflow/.env`)**:
\`\`\`env
DATABASE_URL="postgresql://postgres:password@localhost:5432/taskflow"
AUTH_SECRET="supersecret_auth_key_12345"
NEXTAUTH_URL="http://localhost:3001"
FRONTEND_URL="http://localhost:3000"
\`\`\`

**Frontend (`frontendtaskflow/.env.local`)**:
\`\`\`env
NEXT_PUBLIC_API_URL="http://localhost:3001"
NEXT_PUBLIC_WS_URL="http://localhost:3001"
\`\`\`

### 3. Backend Setup

1. Navigate to the backend directory:
   \`\`\`bash
   cd backendtaskflow
   \`\`\`
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`
3. Push the Prisma schema to the database (or migrate):
   \`\`\`bash
   npx prisma db push
   # OR
   npm run db:migrate
   \`\`\`
4. Seed the database with demo users and projects:
   \`\`\`bash
   npm run db:seed
   \`\`\`
   *(Demo users: admin@taskflow.com, naorin@taskflow.com, rahim@taskflow.com. Password: password123)*
5. Start the backend development server (Runs on port 3001):
   \`\`\`bash
   npm run dev
   \`\`\`

### 4. Frontend Setup

1. Navigate to the frontend directory:
   \`\`\`bash
   cd frontendtaskflow
   \`\`\`
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`
3. Start the frontend development server (Runs on port 3000):
   \`\`\`bash
   npm run dev
   \`\`\`

---

## 🛠️ Development Commands

### Backend
- \`npm run dev\` - Start backend API on port 3001
- \`npm run db:generate\` - Generate Prisma Client
- \`npm run db:migrate\` - Run database migrations
- \`npm run db:seed\` - Populate database with demo data
- \`npm run db:studio\` - Open Prisma Studio to view database

### Frontend
- \`npm run dev\` - Start frontend UI on port 3000
- \`npm run build\` - Build production bundle

---

## Important Notes & Limitations

- **Database Dependency**: The backend will fail to start API routes involving the database if PostgreSQL is not running and correctly configured in `.env`.
- **API CORS**: The backend needs properly configured CORS to accept credentials (cookies) from `localhost:3000`. Ensure standard Next.js CORS headers are applied or use the `cors` package if you transition to custom server.
- **Real-Time Integration**: The architecture is set up to support WebSockets via Socket.IO, but a custom Next.js server (`server.js`) is required to bind Socket.IO to the Next.js process natively on the backend. Currently, it operates via REST APIs.
