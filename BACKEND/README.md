# 📝 Capstone Project: BlogApp

Welcome to the **BlogApp Capstone Project**! This project is a full-stack blogging platform that allows users to register, login, create articles, and share their stories with the world.

## 🚀 Tech Stack

### Frontend (`Blog_FrontEnd`)
- **Framework**: React with Vite
- **Styling**: Tailwind CSS for responsive and modern UI
- **Routing**: React Router DOM
- **State Management**: Zustand
- **Form Handling**: React Hook Form
- **Notifications**: React Hot Toast

### Backend (`BACKEND`)
- **Environment**: Node.js & Express.js
- **Database**: MongoDB (Mongoose Object Data Modeling)
- **Authentication**: JWT (JSON Web Tokens) & bcryptjs for secure password hashing
- **File Uploads**: Cloudinary & Multer for managing article images

---

## 🎨 Frontend & Styling (Tailwind CSS)

For the Frontend (React), **Tailwind CSS** was utilized extensively to construct a modern, fully responsive, and premium UI. Key implementations include:
- **Flexbox/Grid Layouts:** Used for structuring article grids, dashboard views, and complex component alignment.
- **Glassmorphism Effects:** Implementing `backdrop-blur` and shadow utilities (`shadow-lg`, `shadow-xl`) to create elevated cards and modern navigation bars.
- **Interactive States:** Extensive use of `hover:`, `focus:`, `active:`, and `transition` utilities (e.g., `transition-all duration-300 ease-in-out`) for buttons, form inputs, and article cards.
- **Responsive Design:** Utilizing Tailwind's mobile-first breakpoints (`sm:`, `md:`, `lg:`, `xl:`) to ensure the platform scales perfectly from mobile screens to desktop monitors.
- **Custom Color Palette:** Using semantic colors for success, error, and primary brand colors to maintain visual consistency.

---

## 🗄️ Database Schemas & Models

### `UserSchema` (`UserModel.js`)
Represents the users of the platform (Readers, Authors, Admins).
- `firstName`: String, required.
- `lastName`: String, optional.
- `email`: String, required and unique.
- `password`: String, required (hashed using bcrypt).
- `profileImageURL`: String, optional (managed via Cloudinary).
- `role`: String, Enum (`"AUTHOR"`, `"USER"`, `"ADMIN"`), required.
- `isActive`: Boolean, default `true`. Allows for soft deletion.

### `ArticleSchema` (`ArticleModel.js`)
Represents the blog articles created by authors.
- `author`: ObjectId (ref: `user`), required. Links the article to its author.
- `title`: String, required. The main heading of the blog post.
- `Category`: String, required. Used for filtering articles.
- `Content`: String, required. The main body of the article.
- `Comments`: Array of `userCommentSchema` (embeds `user` ObjectId and `comment` string).
- `isArticleActive`: Boolean, default `true`. Used for soft-deletes (Authors can hide their posts without deleting them permanently).

---

## 🌐 API Routes in Detail

### 🔹 Common API (`/common-api`)
Routes accessible to all or multiple user roles. Handled in `CommonAPI.js`.
- `POST /login`: Authenticates a user, verifies the hashed password via bcrypt, and sets a secure HTTP-only JWT cookie (`sameSite: 'none'`, `secure: true`).
- `GET /logout`: Clears the JWT cookie to end the user's session.
- `PUT /change-password`: (Protected) Updates the authenticated user's password after verifying their current password.
- `GET /check-auth`: (Protected) Verifies the JWT token and returns the current user's session data.
- `GET /articles/:id`: (Protected) Fetches a specific article by ID and populates author and comments data.

### 🔹 User API (`/user-api`)
Routes specific to Readers (`USER` role). Handled in `UserAPI.js`.
- `POST /users`: Registers a new user. Uploads their profile image to Cloudinary (using `multer` memory storage) before saving the user document to MongoDB.
- `GET /articles`: (Protected) Retrieves all active articles. Populates author details so users can see who wrote what.
- `PUT /articles`: (Protected) Adds a comment to an active article. Associates the comment with the currently authenticated user's ID.

### 🔹 Author API (`/author-api`)
Routes specific to Content Creators (`AUTHOR` role). Handled in `AuthorAPI.js`.
- `POST /users`: Registers a new author (similar to user registration, but assigns the `AUTHOR` role).
- `POST /articles`: (Protected) Creates a new article. The author ID is securely injected from the JWT payload.
- `PUT /articles`: (Protected) Edits an existing article owned by the author. Verifies ownership before updating.
- `PATCH /articles/:id/status`: (Protected) Soft deletes or restores an article by toggling `isArticleActive`.
- `GET /articles/:authorId`: (Protected) Fetches all articles written by the specified author, including deleted ones (visible only to them).

### 🔹 Admin API (`/admin-api`)
Routes specific to Administrators (`ADMIN` role). Handled in `AdminAPI.js`.
- `GET /users`: (Protected) Retrieves a list of all non-admin users (both Users and Authors).
- `PUT /block`: (Protected) Blocks a user (sets `isActive` to `false`). Blocked users cannot perform authenticated actions.
- `PUT /unblock`: (Protected) Unblocks a user (sets `isActive` to `true`).

---

## 🛠️ Operations Performed on the Folder
- **Authentication Setup**: Configured JWT for secure, stateless user authentication with HTTP-only cookies.
- **Image Handling**: Integrated `multer` and `cloudinary` to handle direct-to-cloud profile picture uploads during registration.
- **Role-Based Middlewares**: Created custom express middlewares (`verifyToken`, `checkAuthor`, `checkUser`) to validate permissions for specific routes.
- **CORS Configuration**: Configured CORS to reflect the request origin, allowing cross-domain communication between the React frontend and Node.js backend.
- **Error Handling**: Implemented centralized error handling in `server.js` to catch Mongoose validation errors, duplicate keys, and return structured error messages.

---

## 🛠️ Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/arjun1228/CAPSTONE_PROJECT.git
   cd CAPSTONE_PROJECT
   ```

2. **Backend Setup:**
   - Navigate to the root directory.
   - Install dependencies: `npm install`
   - Create a `.env` file based on your environment variables:
     ```env
     PORT=3000
     DB_URL=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret
     CLOUDINARY_CLOUD_NAME=your_cloud_name
     CLOUDINARY_API_KEY=your_api_key
     CLOUDINARY_API_SECRET=your_api_secret
     ```
   - Start the backend server: `npm run dev:backend`

3. **Frontend Setup:**
   - Navigate to the frontend directory: `cd Blog_FrontEnd`
   - Install dependencies: `npm install`
   - Create a `.env` file with your backend URL:
     ```env
     VITE_BACKEND_URL=http://localhost:3000
     ```
   - Start the Vite development server: `npm run dev`

---

## 🚀 Deployment Guide

### Backend Deployment (Render)
1. Push your code to a GitHub repository.
2. Go to [Render](https://render.com/) and create a new **Web Service**.
3. Connect your GitHub repository and select the `main` branch.
4. Set the **Root Directory** to `.` (or leave it blank).
5. Set the **Build Command** to `npm install`.
6. Set the **Start Command** to `npm start` (which executes `node BACKEND/server.js`).
7. Add all the Environment Variables from your local `.env` file (`DB_URL`, `JWT_SECRET`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`).
8. Deploy the service.
> **Note**: The backend uses cookies (`sameSite: "none"`, `secure: true`) and CORS is configured to reflect the request origin to allow cross-domain requests from your Vercel frontend.

### Frontend Deployment (Vercel)
1. Go to [Vercel](https://vercel.com/) and create a new Project.
2. Connect your GitHub repository.
3. In the project setup, set the **Framework Preset** to `Vite`.
4. Set the **Root Directory** to `Blog_FrontEnd`.
5. Add the Environment Variable for the backend URL (e.g., `VITE_BACKEND_URL=https://your-render-backend-url.onrender.com`). *Ensure your frontend is configured to use this variable for API calls*.
6. Click **Deploy**.

---

## ⚙️ Development Scripts

- `npm run dev:backend` — Starts the Node.js backend server.
- `npm run dev:frontend` — Starts the React frontend using Vite.

## 👥 Contributing
This is a capstone project repository. All code is maintained on the main branch.
