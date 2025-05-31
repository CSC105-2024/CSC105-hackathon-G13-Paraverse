import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Home from './pages/Home.jsx'
import App from './App.jsx'

// Force React to check local storage before initializing routes
const token = localStorage.getItem('token');
console.log("Initial Token Check:", token ? "Token exists" : "No token found");

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      
    ]
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)