import React from 'react'
import StudentRoute from './StudentRoute'
import StudentDashboard from '../pages/StudentDashboard'
import StudentBooks from '../pages/StudentBook'
import StudentIssueHistory from '../pages/StudentIssueHistory'
import StudentProfile from '../pages/StudentProfile'
import StudentChangePassword from '../pages/StudentChangePassword'
import { Route } from 'react-router-dom'

function StudentRoutes() {
    return (
        <>
            <Route path="/student/dashboard" element={<StudentRoute><StudentDashboard /></StudentRoute>} />
            <Route path="/student/books" element={<StudentRoute><StudentBooks /></StudentRoute>} />
            <Route path="/student/issue-history" element={<StudentRoute><StudentIssueHistory /></StudentRoute>} />
            <Route path="/student/profile" element={<StudentRoute><StudentProfile /></StudentRoute>} />
            <Route path="/student/change-password" element={<StudentRoute><StudentChangePassword /></StudentRoute>} />
        </>
    )
}

export default StudentRoutes