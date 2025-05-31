import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Home from './pages/home.jsx'
import Category from './pages/category.jsx'
import ForgetPasswoed from './pages/forget.jsx'
import Login from './pages/login.jsx'
import Register from './pages/singup.jsx'
import PostYourScenario from './pages/Post.jsx'
import Profile from './pages/Profile.jsx'
import Scenarios from './pages/scenarios.jsx'
import Tag from './pages/tag.jsx'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/Home',
        element: <Home />
      },
      {
        path: '/category',
        element: <Category />
      },
      {
        path: '/forget',
        element: <ForgetPasswoed />
      },
      {
        path: '/login',
        element: <Login />
      },
      {
        path: '/register',
        element: <Register />
      },
      {
        path: '/Post',
        element: <PostYourScenario />
      },
      {
        path: '/Profile',
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
    ]
  }
])
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
