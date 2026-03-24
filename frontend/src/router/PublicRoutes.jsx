import React from 'react'   
import { Route } from 'react-router-dom'
import PublicRoute from './PublicRoute'
import AdminLogin from '../pages/AdminLogin'
import StudentSignup from '../pages/StudentSignup'
import StudentLogin from '../pages/StudentLogin'
import Home from '../pages/Home'
function PublicRoutes() {
    return (
        <>
            <Route index element={<Home />} />

            <Route path="/admin/login" element={<PublicRoute><AdminLogin /></PublicRoute>} />
            <Route path="/student/signup" element={<PublicRoute><StudentSignup /></PublicRoute>} />
            <Route path="/student/login" element={<PublicRoute><StudentLogin /></PublicRoute>} />
        </>
    )
}

export default PublicRoutes