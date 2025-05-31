import {Outlet} from 'react-router-dom'
import './App.css'
import Home from './pages/Home.jsx'
import Category from './pages/category.jsx'
import Navbar from './assets/Navbar.jsx'

function App() {
  return (
    <>
        <Navbar />
        <Outlet />
    </>
  )
}

export default App