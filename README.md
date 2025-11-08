# Wage Tracker 💸

A modern, full-stack application designed to help users track their work hours and calculate earnings with an elegant and responsive interface.

## Live Demo

[Link to your deployed application]

## Overview

Wage Tracker is a web application built with a powerful tech stack, featuring a React/Vite frontend and a NestJS backend. It provides users with secure authentication and a dashboard to manage their work entries. The user interface is designed to be clean and intuitive, with a dynamic 3D background for a touch of elegance.

## Key Features

-   **Secure Authentication:** JWT-based login and registration system with access and refresh tokens.
-   **Work Entry Management:** A dashboard to view and manage work logs.
-   **Dynamic UI:** A responsive and elegant interface built with React and styled with CSS Modules.
-   **3D Background:** An animated particle swarm background created with `@react-three/fiber`.
-   **Full-Stack Architecture:** Clear separation of concerns between the NestJS backend API and the React frontend.

## Tech Stack

| Category      | Technology                                                              |
| :------------ | :---------------------------------------------------------------------- |
| **Frontend**  | React, TypeScript, Vite, Zustand, React Query, React Router, Three.js |
| **Backend**   | NestJS, TypeScript, Express.js, TypeORM                               |
| **Database**  | PostgreSQL                                                              |
| **Auth**      | JWT, Passport.js, bcrypt                                                |
| **Deployment**| Vercel (Frontend), Render (Backend)                                     |

## Local Development Setup

Follow these steps to get the project running on your local machine.

### Prerequisites

-   Node.js (v18 or later recommended)
-   Yarn or npm
-   A running PostgreSQL instance

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/wage-tracker.git
cd wage-tracker
```

### 2. Configure Environment Variables

You will need to create `.env` files for both the frontend and backend.

**Backend Environment (`apps/backend/.env`)**

Create a file named `.env` in the `apps/backend` directory and add the following variables. Adjust the values for your local PostgreSQL setup.

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=wage_tracker

# JWT Secrets
JWT_SECRET=your-super-secret-key
JWT_REFRESH_SECRET=your-other-super-secret-key
```

**Frontend Environment (`frontend/.env.local`)**

Create a file named `.env.local` in the `frontend` directory.

```env
VITE_API_URL=http://localhost:3000/api
```
*Note: The backend runs on port 3000 by default.*

### 3. Install Dependencies

Install dependencies for both the frontend and backend.

```bash
# Install backend dependencies
cd apps/backend
npm install
# or
yarn install

# Install frontend dependencies
cd ../../frontend
npm install
# or
yarn install
```

### 4. Run the Application

Run both development servers in separate terminal windows.

```bash
# In the /apps/backend directory
npm run start:dev
# or
yarn start:dev
```

```bash
# In the /frontend directory
npm run dev
# or
yarn dev
```

The frontend will be available at `http://localhost:5173` (or another port if 5173 is busy), and the backend will be running at `http://localhost:3000`.

## Deployment

This project is pre-configured for easy deployment:

-   **Frontend:** The `frontend` directory can be deployed directly to **Vercel**. Vercel will automatically detect the Vite configuration.
-   **Backend:** The `backend` directory contains a `render.yaml` and a `Dockerfile`, allowing for seamless deployment to **Render** as a Blueprint.
