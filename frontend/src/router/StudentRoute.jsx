import React from 'react'
import { Navigate } from 'react-router-dom'

function StudentRoute({ children }) {
    const studentUser = localStorage.getItem("studentUser");

    if (!studentUser) {
        return <Navigate to="/student/login" />
    }
  return children;
}

export default StudentRoute