import React, { useState } from 'react'
import { toast } from "react-toastify"
import { Link, useNavigate } from "react-router-dom"
import { studentLogin } from '../utils/authApi';

function StudentLogin() {
    const [formData, setFormData] = useState({
        login_id: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)

        try {
            const res = await studentLogin(formData);
            if (res.data.success) {
                localStorage.removeItem("adminUser");
                localStorage.setItem("token", res.data.access);
                localStorage.setItem("refresh", res.data.refresh);
                localStorage.setItem("studentUser", JSON.stringify(res.data));
                navigate("/student/dashboard");
                toast.success(`Welcome back, ${res.data.full_name}! 🎉`);
                toast.info(`(Student ID: ${res.data.student_id})`);
                setFormData({
                    login_id: "",
                    password: "",
                })
            }
            else {
                toast.error(res.data.message || "Login failed 😒")
            }
        }
        catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Invalid login credentials 😒")
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
                                <i className='fa-solid fa-user text-blue-600 mr-2'></i>
                                Student Login
                            </h4>
                            <p className='text-gray-500 text-sm mb-0'>
                                Please enter your login credentials to access your account and explore our library resources.
                            </p>
                        </div>
                    </div>

                    <div className='grid grid-cols-1 gap-4'>

                        <div className='w-full md:w-5/12 mx-auto'>
                            <div className='bg-white border-0 shadow-sm rounded-2xl'>
                                <div className='p-4 flex flex-col'>

                                    <form onSubmit={handleSubmit} className='flex flex-col flex-grow'>

                                        <div className='mb-4'>
                                            <label className='block text-sm font-semibold mb-1'>
                                                Email or Student ID
                                            </label>
                                            <input
                                                type='text'
                                                name='login_id'
                                                className='w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300'
                                                placeholder='Enter your email or student ID'
                                                required
                                                value={formData.login_id}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        <div className='mb-4'>
                                            <label className='block text-sm font-semibold mb-1'>
                                                Password
                                            </label>
                                            <input
                                                type='password'
                                                name='password'
                                                className='w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300'
                                                placeholder='Enter your password'
                                                required
                                                value={formData.password}
                                                onChange={handleChange}
                                            />
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
                                                        Logging in...
                                                    </>
                                                ) : (
                                                    <>
                                                        <i className='fa-solid fa-user-plus mr-2'></i>
                                                        Login
                                                    </>
                                                )}
                                            </button>
                                            <p className='text-center text-gray-500 text-sm mt-2'>
                                                If you don't have an account, please {''}
                                                <Link to='/student/signup' className='text-blue-600 hover:underline'>
                                                    Sign up
                                                </Link>
                                            </p>
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

export default StudentLogin