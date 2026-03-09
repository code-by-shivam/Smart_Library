import React from 'react'
import Header from './components/Header'
import { Routes,Route } from 'react-router-dom'
import AdminLogin from './pages/AdminLogin'
import { ToastContainer } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css"
import AdminDashboard from './pages/AdminDashboard'
import AddCategory from './pages/AddCategory'
const App = () => {
  return (
    <>
    <Header/>
    <ToastContainer/>
    <Routes>
      <Route path='/admin/login' element={<AdminLogin/>}/>
      <Route path='/admin/dashboard' element={<AdminDashboard/>}/>
      <Route path='/admin/add_Category' element={<AddCategory/>}/>
    </Routes>
    </>
  )
}

export default App