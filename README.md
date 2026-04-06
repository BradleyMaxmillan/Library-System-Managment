# Library System Management

A full-stack library management application for tracking books, students, borrowing activity, and circulation analytics.

This project includes:

- A React + Vite frontend for the admin dashboard
- An Express + MongoDB backend API
- JWT-based authentication
- Book, student, and loan management
- Seed scripts for demo data

## Features

- Register and log in as a library admin
- Manage books with create, read, update, and delete actions
- Manage student records
- Borrow books to students
- Mark borrowed books as returned
- Automatically update book availability based on loan status
- View loan history and filter by borrowed or returned
- See dashboard analytics, including:
  - total books
  - active loans
  - returned loans
  - return rate
  - top borrowed books
  - top borrowers
  - recent activity
  - students by department
  - 6-month borrowing trend
- Seed the database with realistic sample data

## Tech Stack

### Frontend

- React 19
- Vite
- React Router

### Backend

- Node.js
- Express
- MongoDB
- Mongoose
- JSON Web Token
- bcryptjs

## Project Structure

```text
Library System Managment/
|-- backend/
|   |-- config/
|   |-- controllers/
|   |-- middleware/
|   |-- models/
|   |-- routes/
|   |-- scripts/
|   `-- server.js
|-- frontend/
|   |-- src/
|   |   |-- api/
|   |   |-- components/
|   |   |-- context/
|   |   |-- hooks/
|   |   `-- pages/
|   `-- package.json
`-- README.md
```

## Main Modules

- Authentication: register, login, current-user session lookup
- Books: catalog management and availability tracking
- Students: borrower profile management
- Loans: create loans, return loans, and track history
- Dashboard: analytics and circulation summaries

## Prerequisites

- Node.js 18+ recommended
- npm
- MongoDB connection string

## Environment Variables

### Backend

Create `backend/.env` and add:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

### Frontend

Optional: create `frontend/.env` if your API is not running at the default URL.

```env
VITE_API_URL=http://localhost:5000/api
```

If `VITE_API_URL` is not set, the frontend defaults to `http://localhost:5000/api`.

## Installation

Install backend dependencies:

```bash
cd backend
npm install
```

Install frontend dependencies:

```bash
cd frontend
npm install
```

## Running the App

Start the backend:

```bash
cd backend
npm run dev
```

Start the frontend in a second terminal:

```bash
cd frontend
npm run dev
```

Default local URLs:

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000/api`

## Seed Demo Data

The backend includes a seed script that creates:

- 72 sample books
- 54 sample students
- 260 returned loans
- 24 active loans
- 1 demo admin user

Run:

```bash
cd backend
npm run seed
```

To wipe existing data and reseed:

```bash
cd backend
npm run seed:reset
```

Demo login after seeding:

- Email: `admin@library.local`
- Password: `admin123`

## Available Scripts

### Backend

- `npm start` - run the API server
- `npm run dev` - run the API server with nodemon
- `npm run seed` - add demo data if the database is empty
- `npm run seed:reset` - clear and reseed the database

### Frontend

- `npm run dev` - start the Vite dev server
- `npm run build` - create a production build
- `npm run preview` - preview the production build
- `npm run lint` - run ESLint

## API Overview

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Books

- `GET /api/books`
- `POST /api/books`
- `GET /api/books/:id`
- `PUT /api/books/:id`
- `DELETE /api/books/:id`

### Students

- `GET /api/students`
- `POST /api/students`
- `GET /api/students/:id`
- `PUT /api/students/:id`
- `DELETE /api/students/:id`

### Loans

- `GET /api/loans`
- `GET /api/loans/analytics/overview`
- `POST /api/loans`
- `PATCH /api/loans/:id/return`

## How It Works

1. An admin registers or logs in.
2. The frontend stores the JWT token and sends it with protected API requests.
3. Books and students can be added and updated from the dashboard.
4. A book can be assigned to a student as a loan.
5. When a loan is returned, the loan status changes and the related book becomes available again.
6. The dashboard aggregates loan and catalog data into analytics cards and charts.

## Notes

- This is an admin-facing system, not a public library member portal.
- The frontend and backend are managed as separate apps inside the same repository.
- There is currently no combined root script to run both apps together.

