import React from 'react'

function AdminDashboard() {
    const adminUser=localStorage.getItem("adminUser");
  return (
    <>
    <p>Hello {adminUser}</p>
    </>
  )
}

export default AdminDashboard