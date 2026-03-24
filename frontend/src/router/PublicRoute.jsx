import React from 'react'

function PublicRoute({ children }) {
    const adminUser = localStorage.getItem("adminUser");
    const studentUser = localStorage.getItem("studentUser");
    if (adminUser) {
        return <Navigate to="/admin/dashboard" />
    }       

    if (studentUser) {
        return <Navigate to="/student/dashboard" />
    }
  return children;
}

export default PublicRoute