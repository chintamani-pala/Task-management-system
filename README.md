# Task Management System

A comprehensive task management application built with React, TypeScript, Node.js, Express, and MongoDB.

## Features

- **User Authentication**: Secure email/password authentication (JWT)
- **Task Creation**: Create tasks with title, description, due date, and priority
- **Task Management**: View, edit, delete, and update task status
- **Priority System**: Organize tasks by priority (Low, Medium, High)
- **Visual Organization**: Color-coded priority lists for quick identification
- **Status Tracking**: Mark tasks as pending or completed
- **Pagination**: Browse through tasks with easy pagination
- **Filtering**: Filter tasks by status and priority
- **Two View Modes**:
  - List view with pagination
  - Priority board view with color-coded columns
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Efficient Data Fetching**: Powered by React Query for optimal performance and caching
- **Drag and Drop**: Smooth interactive task management using dnd-kit

## Setup Instructions

### 1. Backend Setup (Server)

The application requires a MongoDB database and a Node.js server.

1.  Make sure you have **MongoDB** installed and running locally on port `27017` (or update `.env` later).
2.  Navigate to the `server` directory:
    ```bash
    cd server
    ```
3.  Install dependencies:
    ```bash
    npm install
    ```
4.  Create a `.env` file in the `server` directory (copy from `.env.example`):
    ```bash
    cp .env.example .env
    ```
5.  Start the server:
    ```bash
    npm run dev
    ```
    The server runs on `http://localhost:5000`.

### 2. Frontend Setup (Client)

1.  In a new terminal, navigate to the project root:
    ```bash
    cd project
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the frontend application:
    ```bash
    npm run dev
    ```
    The application will launch in your browser.

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Query (TanStack Query)
- **Drag & Drop**: dnd-kit
- **Backend**: Node.js, Express
- **Database**: MongoDB (Mongoose)
- **Authentication**: JWT (JSON Web Tokens)
- **Icons**: Lucide React
- **Build Tool**: Vite

## Database Schema (MongoDB)

### Tasks Collection

- `title`: String (required)
- `description`: String
- `due_date`: Date (required)
- `status`: String ('pending' | 'completed')
- `priority`: String ('low' | 'medium' | 'high')
- `created_by`: ObjectId (User reference)
- `assigned_to`: ObjectId (User reference)
- `created_at`: Date
- `updated_at`: Date

### Users Collection

- `email`: String (unique)
- `password`: String (hashed)
- `createdAt`: Date
