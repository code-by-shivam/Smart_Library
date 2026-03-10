import React from 'react'
import Header from './components/Header'
import { Routes,Route } from 'react-router-dom'
import AdminLogin from './pages/AdminLogin'
import { ToastContainer } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css"
import AdminDashboard from './pages/AdminDashboard'
import AddCategory from './pages/AddCategory'
import ManageCategories from './pages/ManageCategories'
import AddAuthor from './pages/AddAuthor'
import ManageAuthors from './pages/ManageAuthors'
import AddBook from './pages/AddBook'
const App = () => {
  return (
    <>
    <Header/>
    <ToastContainer/>
    <Routes>
      <Route path='/admin/login' element={<AdminLogin/>}/>
      <Route path='/admin/dashboard' element={<AdminDashboard/>}/>
      <Route path='/admin/add_Category' element={<AddCategory/>}/>
      <Route path='/admin/manage_Category' element={<ManageCategories/>}/>
      <Route path='/admin/add_Author' element={<AddAuthor/>}/>
      <Route path='/admin/manage_Author' element={<ManageAuthors/>}/>
      <Route path='/admin/add_Book' element={<AddBook/>}/>
    </Routes>
    </>
  )
}

export default App