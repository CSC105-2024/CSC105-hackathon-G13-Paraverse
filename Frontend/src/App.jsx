import {Outlet} from 'react-router-dom'
import './App.css'
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
