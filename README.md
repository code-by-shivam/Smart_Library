# Smart Library

Smart Library is a full-stack library management system built with Django REST Framework and React. It is designed to solve everyday library operations such as catalog management, student registration, issuing books, return tracking, and fine handling through separate admin and student workflows.

This project is a strong portfolio and placement-ready full-stack application because it demonstrates authentication, role-based access, CRUD operations, dashboard analytics, media handling, pagination, API integration, and deployment.

## Live Demo

- Frontend: [https://smartlibrarymanage.netlify.app](https://smartlibrarymanage.netlify.app)
- Backend API: [https://smart-library-s8sn.onrender.com](https://smart-library-s8sn.onrender.com)


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
CORS_ALLOWED_ORIGINS=
CSRF_TRUSTED_ORIGINS=

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
VITE_API_URL=https://smart-library-s8sn.onrender.com
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

## Author

Created by Shivam.

*If you are a recruiter, interviewer, or collaborator reviewing this project, this repository reflects my hands-on experience with frontend development, backend APIs, authentication, deployment, and end-to-end product thinking.*
