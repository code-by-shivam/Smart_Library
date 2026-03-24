import React from 'react'
import AdminRoute from './AdminRoute'
import AdminDashboard from '../pages/AdminDashboard'
import AddCategory from '../pages/AddCategory'
import ManageCategory from '../pages/ManageCategory'
import AddAuthor from '../pages/AddAuthor'
import ManageAuthors from '../pages/ManageAuthor'
import AddBook from '../pages/AddBook'
import ManageBooks from '../pages/ManageBook'
import IssuedBook from '../pages/IssueBook'
import ManageIssuedBook from '../pages/ManageIssuedBook'
import ManageStudents from '../pages/ManageStudents'
import AdminChangePassword from '../pages/AdminChangePassword'
import { Route } from 'react-router-dom'
import IssuedBookDetail from '../pages/IssuedBookDetail'
import StudentHistory from '../pages/StudentHistory'

function AdminRoutes() {
    return (
        <>
            <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/admin/add-category" element={<AdminRoute><AddCategory /></AdminRoute>} />
            <Route path="/admin/manage-category" element={<AdminRoute><ManageCategory /></AdminRoute>} />
            <Route path="/admin/add-author" element={<AdminRoute><AddAuthor /></AdminRoute>} />
            <Route path="/admin/manage-author" element={<AdminRoute><ManageAuthors /></AdminRoute>} />
            <Route path="/admin/add-book" element={<AdminRoute><AddBook /></AdminRoute>} />
            <Route path="/admin/manage-book" element={<AdminRoute><ManageBooks /></AdminRoute>} />
            <Route path="/admin/issue-book" element={<AdminRoute><IssuedBook /></AdminRoute>} />
            <Route path="/admin/issued-books" element={<AdminRoute><ManageIssuedBook /></AdminRoute>} />
            <Route path="/admin/manage-students" element={<AdminRoute><ManageStudents /></AdminRoute>} />
            <Route path="/admin/change-password" element={<AdminRoute><AdminChangePassword /></AdminRoute>} />
            <Route path="/admin/issued/book/details/:id" element={<AdminRoute><IssuedBookDetail /></AdminRoute>} />
            <Route path="/admin/student-history/:student_id" element={<AdminRoute><StudentHistory /></AdminRoute>} />
        </>
    )
}

export default AdminRoutes