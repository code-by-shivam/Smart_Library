import React, { useEffect, useState } from 'react'
import { toast } from "react-toastify"
import { useNavigate } from 'react-router-dom'
import { changePassword } from '../utils/studentApi'

function AdminChangePassword() {
    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showCurrentPassword, setShowCurrentPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();


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
            const res = await changePassword({
                current_password: currentPassword,
                new_password: newPassword,
                confirm_password: confirmPassword
            })
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
                className='py-10'
                style={{
                    background: "linear-gradient(135deg,#f3f4ff,#fdfbff)",
                    minHeight: "100vh"
                }}
            >
                <div className='max-w-7xl mx-auto px-4'>

                    <div className='flex justify-center mb-6'>
                        <div className='w-full lg:w-3/4 text-center'>
                            <h4 className='font-bold mb-2 text-xl'>
                                <i className='fa-solid fa-key text-blue-600 mr-2'></i>
                                Admin Change Password
                            </h4>
                            <p className='text-gray-500 text-sm mb-0'>
                                Update your's account password.
                            </p>
                        </div>
                    </div>

                    <div className='grid grid-cols-1 gap-4'>

                        <div className='w-full md:w-2/3 mx-auto'>
                            <div className='bg-white border-0 shadow-sm rounded-2xl'>
                                <div className='p-4 flex flex-col'>

                                    <form onSubmit={handleSubmit} className='flex flex-col flex-grow'>

                                        <div className='mb-4'>
                                            <label className='block text-sm font-semibold mb-1'>
                                                Current Password
                                            </label>
                                            <div className='flex'>
                                                <span className='inline-flex items-center px-3 border border-r-0 border-gray-300 rounded-l bg-white'>
                                                    <i className='fa-solid fa-lock mr-1'></i>
                                                </span>
                                                <input
                                                    type={showCurrentPassword ? "text" : "password"}
                                                    className='flex-1 border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300'
                                                    placeholder='Enter Current Password'
                                                    required
                                                    value={currentPassword}
                                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                                />
                                                <button
                                                    type='button'
                                                    className='border border-l-0 border-gray-300 text-gray-600 hover:bg-gray-100 px-3 py-1.5 rounded-r transition-colors'
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

                                        <div className='mb-4'>
                                            <label className='block text-sm font-semibold mb-1'>
                                                New Password
                                            </label>
                                            <div className='flex'>
                                                <span className='inline-flex items-center px-3 border border-r-0 border-gray-300 rounded-l bg-white'>
                                                    <i className='fa-solid fa-key mr-1'></i>
                                                </span>
                                                <input
                                                    type={showNewPassword ? "text" : "password"}
                                                    className='flex-1 border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300'
                                                    placeholder='Enter New Password'
                                                    required
                                                    value={newPassword}
                                                    onChange={(e) => setNewPassword(e.target.value)}
                                                />
                                                <button
                                                    type='button'
                                                    className='border border-l-0 border-gray-300 text-gray-600 hover:bg-gray-100 px-3 py-1.5 rounded-r transition-colors'
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

                                        <div className='mb-4'>
                                            <label className='block text-sm font-semibold mb-1'>
                                                Confirm New Password
                                            </label>
                                            <div className='flex'>
                                                <span className='inline-flex items-center px-3 border border-r-0 border-gray-300 rounded-l bg-white'>
                                                    <i className='fa-solid fa-key mr-1'></i>
                                                </span>
                                                <input
                                                    type={showConfirmPassword ? "text" : "password"}
                                                    className='flex-1 border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300'
                                                    placeholder='Confirm New Password'
                                                    required
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                />
                                                <button
                                                    type='button'
                                                    className='border border-l-0 border-gray-300 text-gray-600 hover:bg-gray-100 px-3 py-1.5 rounded-r transition-colors'
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
                                                className='w-full bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded transition-colors disabled:opacity-60'
                                                disabled={loading}
                                            >
                                                {loading ? (
                                                    <>
                                                        <span className='inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2' role='status' aria-hidden='true'></span>
                                                        Updating...
                                                    </>
                                                ) : (
                                                    <>
                                                        <i className='fa-solid fa-floppy-disk mr-2'></i>
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