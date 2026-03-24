import React, { useEffect, useState } from 'react'
import { toast } from "react-toastify"
import { useNavigate } from 'react-router-dom'
import { changePassword } from '../utils/studentApi';


function StudentChangePassword() {

    const [form, setForm] = useState({
        current_password: "",
        new_password: "",
        confirm_password: "",
    });

    const [saving, setSaving] = useState(false);
    const navigate = useNavigate();
    const studentUser = JSON.parse(localStorage.getItem("studentUser"));


   

    const handleChangeSubmit = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (form.new_password !== form.confirm_password) {
            toast.error("New password and confirm password do not match 😒");
            return;
        }

        if (form.new_password.length < 6) {
            toast.error("New password must be at least 6 characters long 😒");
            return;
        }

        try {
            setSaving(true);
            const res = await changePassword(
                {
                    current_password: form.current_password,
                    new_password: form.new_password,
                    confirm_password: form.confirm_password,
                }
            );
            toast.success(res.data.message || "Password updated successfully 😎");
            setForm({
                current_password: "",
                new_password: "",
                confirm_password: "",
            });
        } catch (err) {
            console.error(err);
            toast.error(
                err.response?.data?.message ||
                "Failed to update profile 😒"
            );
        } finally {
            setSaving(false);
        }
    }

    return (

        <div className='py-10' style={{ background: "linear-gradient(135deg,#f3f4ff,#fdfbff)", minHeight: "100vh" }}>

            <div className='max-w-7xl mx-auto px-4'>

                <div className='flex items-center gap-3 mb-6'>

                    <span
                        className='inline-flex items-center justify-center rounded-full'
                        style={{ width: "45px", height: "45px", background: "#e0e7ff" }}
                    >
                        <i className='fa-solid fa-key text-blue-600 text-lg'></i>
                    </span>

                    <div>
                        <h4 className='mb-0 text-xl font-semibold'>Change Password</h4>
                        <p className='text-gray-500 mb-0'>
                            Update your password.
                        </p>
                    </div>

                    <p
                        className='text-gray-500 mb-0 ml-auto italic rounded px-2 py-1'
                        style={{ background: "#e0e7ff" }}
                    >
                        Welcome, {studentUser.full_name}!
                    </p>

                </div>

                <div
                    className='flex justify-center bg-white rounded p-4 shadow-sm mx-auto'
                    style={{ maxWidth: "700px" }}
                >

                    <form onSubmit={handleSubmit} className='w-full'>

                        <div className='mb-4'>
                            <label htmlFor='current_password' className='block mb-1 text-sm font-medium text-gray-700'>
                                Current Password
                            </label>
                            <input
                                type='password'
                                className='w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300'
                                id='current_password'
                                name='current_password'
                                placeholder='Enter your current password......'
                                value={form.current_password}
                                onChange={handleChangeSubmit}
                                required
                            />
                        </div>

                        <div className='mb-4'>
                            <label htmlFor='new_password' className='block mb-1 text-sm font-medium text-gray-700'>
                                New Password
                            </label>
                            <input
                                type='password'
                                className='w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300'
                                placeholder='Enter a new password'
                                id='new_password'
                                name='new_password'
                                value={form.new_password}
                                onChange={handleChangeSubmit}
                                required
                            />
                        </div>

                        <div className='mb-4'>
                            <label htmlFor='confirm_password' className='block mb-1 text-sm font-medium text-gray-700'>
                                Confirm Password
                            </label>
                            <input
                                type='password'
                                className='w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300'
                                id='confirm_password'
                                name='confirm_password'
                                placeholder='Confirm the new password'
                                value={form.confirm_password}
                                onChange={handleChangeSubmit}
                                required
                            />
                        </div>

                        <button
                            type='submit'
                            disabled={saving}
                            className={`px-4 py-2 rounded text-white transition-colors disabled:opacity-60 ${saving ? "bg-gray-500" : "bg-blue-600 hover:bg-blue-700"}`}
                        >
                            {saving ? (
                                <>
                                    <span
                                        className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"
                                        role="status"
                                        aria-hidden="true"
                                    ></span>
                                    Changing...
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-key mr-2"></i>
                                    Change Password
                                </>
                            )}
                        </button>

                    </form>

                </div>

            </div>

        </div>

    )
}

export default StudentChangePassword