import {Outlet} from 'react-router-dom'
import './App.css'
import Navbar from './assets/Navbar.jsx'
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <div>
        <Navbar />
        <Outlet />
      </div>
    </AuthProvider>
  )
}

export default App