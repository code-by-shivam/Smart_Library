# Smart Library

Smart Library is a full-stack library management system built with Django REST Framework and React. It is designed to solve everyday library operations such as catalog management, student registration, issuing books, return tracking, and fine handling through separate admin and student workflows.

This project is a strong portfolio and placement-ready full-stack application because it demonstrates authentication, role-based access, CRUD operations, dashboard analytics, media handling, pagination, API integration, and deployment.

## Live Demo

- Frontend: [https://smartlibrarymanage.netlify.app](https://smartlibrarymanage.netlify.app)
- Backend API: [https://smart-library-s8sn.onrender.com](https://smart-library-s8sn.onrender.com)

## Why This Project Is Good For Placements

- Built as a real end-to-end product, not just isolated CRUD pages
- Clear separation between backend API and frontend client
- Uses JWT authentication for secure login flows
- Supports role-based experiences for admins and students
- Includes image upload support for book covers
- Shows practical business logic such as stock tracking, issue/return flow, and student blocking
- Demonstrates deployment on Netlify and Render

## Problem Statement

Managing a library manually becomes difficult when the number of books and students grows. Smart Library digitizes the process by helping administrators manage books, authors, categories, students, and issued records from one dashboard, while students can log in to browse available books and track their own issue history.

## Main Features

### Admin Module

- Secure admin login
- Dashboard with library statistics
- Add, update, list, and delete categories
- Add, update, list, and delete authors
- Add, update, list, and delete books
- Upload book cover images
- Manage registered students
- Block and unblock student accounts
- Search student details by student ID
- Search books by ISBN or title
- Issue books to students with due date and remark
- Return books and record fines
- View issued book details and student issue history

### Student Module

- Student registration
- Login using email or student ID
- Dashboard with personal statistics
- Browse available books
- Filter books by category and author
- View issued book history
- Update profile
- Change password

## Tech Stack

### Frontend

- React
- Vite
- React Router
- Axios
- Tailwind CSS
- React Toastify

### Backend

- Django
- Django REST Framework
- Simple JWT
- SQLite
- Cloudinary
- django-cors-headers

## Architecture Overview

The project follows a client-server architecture:

- The Django backend exposes REST APIs for authentication, student management, book management, issue/return operations, and dashboard stats.
- The React frontend consumes those APIs and provides separate route flows for public users, admins, and students.
- JWT tokens are used for authenticated API communication.
- Cloudinary is used to store and serve uploaded book cover images.

## Core Data Model

The backend is centered around these main entities:

- `User`: custom authentication model
- `Student`: one-to-one profile linked to `User`
- `Category`: groups books by type or genre
- `Author`: stores author records
- `Book`: stores catalog details, pricing, quantity, and cover image
- `IssuedBook`: tracks which student borrowed which book, due date, return date, fine, and remarks

## Project Structure

```text
SmartLibrary/
|-- backend/
|   |-- library_main/
|   |-- libraryapp/
|   |-- manage.py
|   `-- requirements.txt
|-- frontend/
|   |-- src/
|   |   |-- components/
|   |   |-- pages/
|   |   |-- router/
|   |   `-- utils/
|   |-- package.json
|   `-- vite.config.js
`-- README.md
```

## API Highlights

Some important API groups available in the backend:

- Admin authentication
- Student authentication
- Category management
- Author management
- Book management
- Student management
- Book issue and return management
- Dashboard statistics
- Student profile and issue history

Base API URL:

```text
https://smart-library-s8sn.onrender.com/api/
```

## Local Setup

### 1. Clone The Repository

```bash
git clone <your-repository-url>
cd SmartLibrary
```

### 2. Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

Create a `.env` file in `backend/` with values similar to:

```env
SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=127.0.0.1,localhost
CORS_ALLOW_ALL_ORIGINS=True
CORS_ALLOWED_ORIGINS=http://localhost:5173
CSRF_TRUSTED_ORIGINS=http://localhost:5173

cloud_name=your-cloudinary-cloud-name
api_key=your-cloudinary-api-key
api_secret=your-cloudinary-api-secret
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Create a `.env` file in `frontend/`:

```env
VITE_API_URL=http://127.0.0.1:8000
```

## Deployment

### Frontend

- Hosted on Netlify
- Live URL: [https://smartlibrarymanage.netlify.app](https://smartlibrarymanage.netlify.app)

### Backend

- Hosted on Render
- Live URL: [https://smart-library-s8sn.onrender.com](https://smart-library-s8sn.onrender.com)

## Key Full-Stack Concepts Demonstrated

- REST API design
- JWT authentication
- Role-based routing
- State management with React hooks
- Server-side pagination
- Search and filtering
- Media upload and cloud storage
- Protected routes
- Deployment and environment configuration

## Interview Talking Points

If you present this project in a placement or interview, these are strong points to explain:

- Why you used Django REST Framework for backend APIs
- How you separated admin and student workflows
- How JWT authentication works in the project
- How book quantity and availability are managed
- How issue and return records are tracked
- How Cloudinary is integrated for image uploads
- How frontend routes are protected
- What challenges you faced during deployment and API integration

## Suggested Future Improvements

- Add automated tests for backend and frontend
- Add refresh-token based silent re-authentication
- Add fine calculation based on overdue days
- Add email notifications for due dates
- Add reporting and export features
- Add stronger role and permission validation
- Improve mobile responsiveness further

## Resume-Friendly Project Summary

Built a full-stack Smart Library Management System using Django REST Framework and React with JWT-based authentication, role-based admin and student workflows, Cloudinary image uploads, search, filtering, pagination, dashboard analytics, and deployed frontend/backend architecture on Netlify and Render.

## Author

Created by Shivam.
