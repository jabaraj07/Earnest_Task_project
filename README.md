# Earnest Data Analytics Project

This repository contains a full-stack task management application with a Next.js frontend and an Express + Prisma backend.

## Project Structure

- `Backend/` - Express API server written in TypeScript
- `frontend/` - Next.js frontend application with Tailwind CSS

## Prerequisites

- Node.js 18+ / npm
- MySQL database

## Backend Setup

1. Open a terminal and navigate to the backend folder:

   ```bash
   cd Backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in `Backend/` with the following variables:

   ```env
   PORT=5000
   DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE_NAME"
   JWT_ACCESS_SECRET=your_access_secret
   JWT_REFRESH_SECRET=your_refresh_secret
   ```

4. Run database migrations and generate Prisma client (if needed):

   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```

5. Start the backend server:

   ```bash
   npm run dev
   ```

6. The API should be available at:

   ```text
   http://localhost:5000
   ```

### Backend API Routes

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `GET /api/tasks`
- `POST /api/tasks`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`
- `PATCH /api/tasks/:id/status`

## Frontend Setup

1. Open a separate terminal and navigate to the frontend folder:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env.local` file in `frontend/` with the API base URL:

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

4. Start the Next.js development server:

   ```bash
   npm run dev
   ```

5. The frontend should be available at:

   ```text
   http://localhost:3000
   ```

## Recommended Workflow

- Start the backend first so the API is available.
- Then start the frontend.
- Use the application to register, login, create tasks, edit tasks, toggle status, and delete tasks.

## Build for Production

### Backend

```bash
cd Backend
npm run build
npm start
```

### Frontend

```bash
cd frontend
npm run build
npm start
```

## Notes

- The frontend expects cookies for authentication when calling protected endpoints.
- If you change the backend port, update `NEXT_PUBLIC_API_URL` in the frontend accordingly.

## Optional: Run Both with One Terminal

If you want to run both projects concurrently, you can use a tool like `concurrently` or open two terminal windows.

---