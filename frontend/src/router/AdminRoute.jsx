import React from 'react'
import { Navigate } from 'react-router-dom';

const AdminRoute = ({children}) => {
    const adminUser = localStorage.getItem("adminUser");

    if(!adminUser){
        return <Navigate to="/admin/login" />
    }
  return children;
}

export default AdminRoute