import React from 'react'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router'
import RootLayout from './components/RootLayout'
import Home from './components/Home'
import Login from './components/Login'
import Register from './components/Register'
import UserDashboard from './components/UserDashboard'
import AuthorDashboard from './components/AuthorDashboard'
import AdminDashboard from './components/AdminDashboard'
import {Toaster} from 'react-hot-toast'
import ProtectedRoute from './components/ProtectedRoute'
import ErrorBoundary from './components/ErrorBoundary'
import EditArticle from './components/EditArticleForm'
import WriteArticle from './components/WriteArticle'
import AuthorArticles from './components/AuthorArticles'
import ArticleByID from './components/ArticleById'
import Unauthorized from './components/Unauthorized'



function App() {
  const routerObj = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      errorElement: <ErrorBoundary />,
      children: [
        {
          path: "",
          element: <Home />
        },
        {
          path: "login",
          element : <Login />
        },
        {
          path: "register",
          element : <Register />
        },
        {
          path: "userdashboard",
          element: <ProtectedRoute allowedRoles={["USER"]}>
                  <UserDashboard />
                  </ProtectedRoute>
        },
        {
          path: "user-profile",
          element: <ProtectedRoute allowedRoles={["USER"]}>
            <UserDashboard />
            </ProtectedRoute>
        },
        {
          path: "authordashboard",
          element:  <ProtectedRoute allowedRoles={["AUTHOR"]}>
                  <AuthorDashboard />
                  </ProtectedRoute>,
          children: [
            {
              index: true,
              element: <Navigate to="articles" replace />,
            },
            {
              path: "articles",
              element: <AuthorArticles />,
            },
            {
              path: "write-article",
              element: <WriteArticle />,
            },
          ],
        },
        {
          path: "author-profile",
          element:  <ProtectedRoute allowedRoles={["AUTHOR"]}>
                  <AuthorDashboard />
                  </ProtectedRoute>,
          children: [
            {
              index: true,
              element: <Navigate to="articles" replace />,
            },
            {
              path: "articles",
              element: <AuthorArticles />,
            },
            {
              path: "write-article",
              element: <WriteArticle />,
            },
          ],
        },
        {
          path: "article/:id",
          element: <ProtectedRoute allowedRoles={["USER", "AUTHOR"]}>
            <ArticleByID />
            </ProtectedRoute>
        },
        {
          path: "edit-article/:id",
          element: <ProtectedRoute allowedRoles={["AUTHOR"]}>
                  <EditArticle />
                  </ProtectedRoute>
        },
        {
          path: "edit-article",
          element: <ProtectedRoute allowedRoles={["AUTHOR"]}>
                  <EditArticle />
                  </ProtectedRoute>
        },
        {
          path: "admindashboard",
          element: <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminDashboard />
            </ProtectedRoute>
        },
        {
          path: "unauthorized",
          element: <Unauthorized />
        }
      ]
    }
  ])
  
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <RouterProvider router={routerObj} />
    </>
  )
}

export default App


