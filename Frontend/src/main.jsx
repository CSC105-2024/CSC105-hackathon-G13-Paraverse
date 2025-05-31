import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Home from './pages/home.jsx'
import Category from './pages/category.jsx'
import ForgetPassword from './pages/forget.jsx'
import Login from './pages/login.jsx'
import SignUp from './pages/SignUp.jsx'
import PostYourScenario from './pages/Post.jsx'
import Profile from './pages/Profile.jsx'
import Scenarios from './pages/scenarios.jsx'
import Tag from './pages/tag.jsx'
import { AuthProvider } from './context/AuthContext' // Add this import
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import ResetPassword from './pages/ResetPassword.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: '/home',
        element: <Home />
      },
      {
        path: '/category',
        element: <Category />
      },
      {
        path: '/ForgotPassword',
        element: <ForgetPassword />
      },
      {
        path: '/login',
        element: <Login />
      },
      {
        path: '/signup',
        element: <SignUp />
      },
      {
        path: '/post',
        element: <PostYourScenario />
      },
      {
        path: '/profile',
        element: <Profile />
      },
      {
        path: '/scenarios',
        element: <Scenarios />
      },
      {
        path: '/tag',
        element: <Tag />
      },
      {
        path: '/resetPassword/:token',
        element: <ResetPassword/>
      }
    ]
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Wrap with AuthProvider */}
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
);

