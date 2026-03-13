import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"

function AdminChangePassword() {
    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showCurrentPassword, setShowCurrentPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();

    const adminUser = localStorage.getItem("adminUser");

    useEffect(() => {
        if (!adminUser) {
            navigate("/admin/login")
        }
    }, [])
 
    const handleSubmit = async (e) => {
        e.preventDefault();
        if(newPassword !== confirmPassword) {
            toast.error("New Password and Confirm Password do not match 😒")
            return;
        }
        if(newPassword.length < 6) {
            toast.error("New Password must be at least 6 characters long 😒");
            return;
        } 

        setLoading(true)

        try {
            const res = await axios.post("http://127.0.0.1:8000/api/admin/change-password/", { username: adminUser,
                 current_password: currentPassword,
                  new_password: newPassword, 
                  confirm_password: confirmPassword });
            if (res.data.success) {
                toast.success(res.data.message || "Password Changed Successfully 👌")
                setCurrentPassword("")
                setNewPassword("")
                setConfirmPassword("")
            }
            else {
                toast.error(res.data.message || "Failed to change password 😒")
            }
        }
        catch (err) {
            console.error(err);
            if(err.response && err.response.data && err.response.data.message) {
                toast.error(err.response.data.message)
            }
            else{
                toast.error("An error occured while changing the password ")
            }
        }
        finally {
            setLoading(false)
        }
    }

    return (
        <>
            <div
                className='py-5'
                style={{
                    background: "linear-gradient(135deg,#f3f4ff,#fdfbff)",
                    minHeight: "100vh"
                }}
            >
                <div className='container'>

                    {/* Page Heading */}
                    <div className='row justify-content-center mb-4'>
                        <div className='col-lg-9 text-center'>
                            <h4 className='fw-bold mb-2'>
                                <i className='fa-solid fa-key text-primary me-2'></i>
                                Admin Change Password
                            </h4>
                            <p className='text-muted small mb-0'>
                                Update your's account password.
                            </p>
                        </div>
                    </div>

                    <div className='row g-4'>

                        {/* Add Author Form */}
                        <div className='col-md-8 mx-auto'>
                            <div className='card border-0 shadow-sm rounded-4 h-60'>
                                <div className='card-body p-4 d-flex flex-column'>

                                    <form onSubmit={handleSubmit} className='d-flex flex-column flex-grow-1'>

                                        <div className='mb-3'>
                                            <label className='form-label small fw-semibold mb-1'>
                                                Current Password
                                            </label>
                                            <div className='input-group'>
                                                <span className='input-group-text bg-white'>
                                                    <i className='fa-solid fa-lock me-1'></i>
                                                </span>
                                                <input
                                                type={showCurrentPassword ? "text" : "password"}
                                                className='form-control form-control-sm'
                                                placeholder='Enter Current Password'
                                                required
                                                value={currentPassword}
                                                onChange={(e) => setCurrentPassword(e.target.value)}
                                            />
                                            <button
                                                type='button'
                                                className='btn btn-outline-secondary'
                                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                            >
                                                {showCurrentPassword ? (
                                                    <i className='fa-solid fa-eye-slash'></i>
                                                ) : (
                                                    <i className='fa-solid fa-eye'></i>
                                                )}
                                            </button>
                                            </div>
                                        </div>
                                        <div className='mb-3'>
                                            <label className='form-label small fw-semibold mb-1'>
                                                New Password
                                            </label>
                                            <div className='input-group'>
                                                <span className='input-group-text bg-white'>
                                                    <i className='fa-solid fa-key me-1'></i>
                                                </span>
                                                <input
                                                type={showNewPassword ? "text" : "password"}
                                                className='form-control form-control-sm'
                                                placeholder='Enter New Password'
                                                required
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                            />
                                            <button
                                                type='button'
                                                className='btn btn-outline-secondary'
                                                onClick={() => setShowNewPassword(!showNewPassword)}
                                            >
                                                {showNewPassword ? (
                                                    <i className='fa-solid fa-eye-slash'></i>
                                                ) : (
                                                    <i className='fa-solid fa-eye'></i>
                                                )}
                                            </button>
                                            </div>
                                        </div>
                                        <div className='mb-3'>
                                            <label className='form-label small fw-semibold mb-1'>
                                                Confirm New Password
                                            </label>
                                            <div className='input-group'>
                                                <span className='input-group-text bg-white'>
                                                    <i className='fa-solid fa-key me-1'></i>
                                                </span>
                                                <input
                                                type={showConfirmPassword ? "text" : "password"}
                                                className='form-control form-control-sm'
                                                placeholder='Confirm New Password'
                                                required
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                            />
                                            <button
                                                type='button'
                                                className='btn btn-outline-secondary'
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            >
                                                {showConfirmPassword ? (
                                                    <i className='fa-solid fa-eye-slash'></i>
                                                ) : (
                                                    <i className='fa-solid fa-eye'></i>
                                                )}
                                            </button>
                                            </div>
                                        </div>


                                        <div className='mt-auto'>
                                            <button
                                                type='submit'
                                                className='btn btn-primary w-100 btn-sm'
                                                disabled={loading}
                                            >
                                                {loading ? (
                                                    <>
                                                        <span className='spinner-border spinner-border-sm me-2' role='status' aria-hidden='true'></span>
                                                        Updating...
                                                    </>
                                                ) : (
                                                    <>
                                                        <i className='fa-solid fa-floppy-disk me-2'></i>
                                                        Update Password
                                                    </>
                                                )}
                                            </button>
                                        </div>

                                    </form>

                                </div>
                            </div>
                        </div>



                    </div>

                </div>
            </div>
        </>
    )
}

export default AdminChangePassword