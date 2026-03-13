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
import ManageBooks from './pages/ManageBooks'
import AdminChangePassword from './pages/AdminChangePassword'
import UserSignUp from './pages/UserSignUp'
import UserLogin from './pages/UserLogin'
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
      <Route path='/admin/manage_Book' element={<ManageBooks/>}/>
      <Route path='/admin/change_password' element={<AdminChangePassword/>}/>
      <Route path='/user/signup' element={<UserSignUp/>}/>
      <Route path='/user/login' element={<UserLogin/>}/>
    </Routes>
    </>
  )
}

export default App