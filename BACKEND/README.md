# Blog App Backend

This repository contains the backend code for the Blog Application. It is built using Node.js, Express, and MongoDB, and provides robust APIs for authentication, article management, and user administration.

## 🚀 Features & Operations Done
- **Authentication:** JWT-based authentication using HTTP-only secure cookies.
- **Role-Based Access Control:** Distinct roles for `ADMIN`, `AUTHOR`, and `USER`.
- **Image Upload:** Integrated with Cloudinary and Multer for profile image uploads.
- **Database:** MongoDB for robust data modeling and relationships.

---

## 🗄️ Database Models

### 1. User Model (`UserModel.js`)
- `firstName` (String, Required)
- `lastName` (String)
- `email` (String, Required, Unique)
- `password` (String, Required)
- `profileImageURL` (String)
- `role` (Enum: `AUTHOR`, `USER`, `ADMIN`)
- `isActive` (Boolean, default: true)

### 2. Article Model (`ArticleModel.js`)
- `author` (ObjectId, Ref: `user`, Required)
- `title` (String, Required)
- `Category` (String, Required)
- `Content` (String, Required)
- `Comments` (Array of objects: `user` (ObjectId), `comment` (String))
- `isArticleActive` (Boolean, default: true)

---

## 🛣️ API Routes Overview

### 🔑 Common Routes (`/common-api`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| `POST` | `/login` | Authenticate user and return JWT in cookie | Public |
| `GET`  | `/logout` | Clear JWT cookie to logout | Public |
| `PUT`  | `/change-password` | Update account password | Authenticated |
| `GET`  | `/check-auth` | Verify current user session | Authenticated |
| `GET`  | `/articles/:id` | Get specific article by ID | Authenticated |

### 🛡️ Admin Routes (`/admin-api`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| `GET`  | `/users` | Get all users for admin dashboard | `ADMIN` |
| `PUT`  | `/block` | Block a user (soft delete) | `ADMIN` |
| `PUT`  | `/unblock` | Unblock a user | `ADMIN` |

### ✍️ Author Routes (`/author-api`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| `POST` | `/users` | Register a new author (with profile image) | Public |
| `POST` | `/articles` | Create a new article | `AUTHOR` |
| `PATCH`| `/articles/:id/status`| Soft delete or restore an article | `AUTHOR` |
| `GET`  | `/articles/:authorId`| Read all articles of a specific author | `AUTHOR` |
| `PUT`  | `/articles` | Edit an existing article | `AUTHOR` |

### 👤 User Routes (`/user-api`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| `POST` | `/users` | Register a new user (with profile image) | Public |
| `GET`  | `/articles` | Get all active articles | `USER` |
| `PUT`  | `/articles` | Add a comment to an article | `USER` |

---

## 🎨 Frontend & Styling (Tailwind CSS)
*Note: This repository specifically contains the Backend architecture.*
For the Frontend (React), **Tailwind CSS** was utilized extensively to construct a modern, fully responsive UI. Key implementations include:
- **Flexbox/Grid layouts** for article grids and dashboard views.
- **Glassmorphism effects** (`backdrop-blur`) and shadow utilities for cards and navigation bars.
- **Interactive States:** Extensive use of `hover:`, `focus:`, and `transition` utilities for buttons and forms.
- **Responsive Design:** `md:`, `lg:` breakpoints to ensure the platform looks premium on mobile and desktop devices alike.

## 🛠️ Setup & Run Instructions
1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Add a `.env` file with MongoDB URI, Cloudinary Config, and JWT Secret.
4. Run `npm start` or `npm dev` to start the backend server.
