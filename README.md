# Wage Tracker 💸

A modern, full-stack application designed to help users track their work hours and calculate earnings with an elegant and responsive interface.

## Live Demo

[Link to your deployed application] <!-- TODO: Replace with your actual deployment link -->

## Overview

Wage Tracker is a monorepo web application built with a powerful tech stack, featuring a React/Vite frontend and a NestJS backend. It provides users with secure authentication and a dashboard to manage their jobs and work entries. The user interface is designed to be clean and intuitive, with a dynamic 3D background for a touch of elegance.

## Key Features

-   **Secure Authentication:** JWT-based login and registration system with access and refresh tokens.
-   **Job & Work Entry Management:** A dashboard to view, add, and delete jobs and daily work logs.
-   **Dynamic UI:** A responsive and elegant interface built with React and styled with CSS Modules.
-   **3D Experience:** An animated background created with `@react-three/fiber`.
-   **Internationalization:** Support for multiple languages (English and Vietnamese) using `i18next`.
-   **Full-Stack Architecture:** Clear separation of concerns between the NestJS backend API and the React frontend.

## Tech Stack

| Category      | Technology                                                              |
| :------------ | :---------------------------------------------------------------------- |
| **Frontend**  | React, TypeScript, Vite, Zustand, React Query, React Router, Three.js, i18next |
| **Backend**   | NestJS, TypeScript, TypeORM                               |
| **Database**  | PostgreSQL (with Neon)                                                  |
| **Auth**      | JWT, Passport.js, bcrypt                                                |
| **Deployment**| Render (Backend), Vercel/Netlify (Frontend)                             |

## Local Development Setup

Follow these steps to get the project running on your local machine.

### Prerequisites

-   Node.js (v18 or later recommended)
-   Yarn
-   A running PostgreSQL instance (local or cloud-hosted like Neon).

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/wage-tracker.git
cd wage-tracker
```

### 2. Configure Environment Variables

You will need to create `.env` files for both the frontend and backend.

**Backend Environment (`apps/backend/.env`)**

Create a file named `.env` in the `apps/backend` directory. The application is configured to use a database connection string.

```env
# Database URL (recommended)
# Example for a local PostgreSQL instance:
DATABASE_URL="postgresql://your_db_user:your_db_password@localhost:5432/wage_tracker"

# JWT Secrets (replace with your own secrets)
JWT_SECRET=your-super-secret-key
JWT_REFRESH_SECRET=your-other-super-secret-key
```

**Frontend Environment (`frontend/.env`)**

Create a file named `.env` in the `frontend` directory.

```env
# The URL of your running backend API
VITE_API_URL=http://localhost:3000/api
```
*Note: The backend runs on port 3000 by default.*

### 3. Install Dependencies

This project uses Yarn workspaces. Install all dependencies from the root directory.

```bash
yarn install
```

### 4. Run the Application

Run both development servers in separate terminal windows.

**Backend:**
```bash
# In the /apps/backend directory
yarn start:dev
```

**Frontend:**
```bash
# In the /frontend directory
yarn dev
```

The frontend will be available at `http://localhost:5173` (or another port if 5173 is busy), and the backend will be running at `http://localhost:3000`.

## Deployment

This project is pre-configured for easy deployment:

-   **Frontend:** The `frontend` directory can be deployed directly to a service like **Vercel** or **Netlify**.
-   **Backend:** The `render.yaml` file is configured for deploying the backend service on **Render**.
