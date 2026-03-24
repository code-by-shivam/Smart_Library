import React, { useState } from 'react'
import { toast } from "react-toastify"
import { Link } from "react-router-dom"
import { studentSignup } from '../utils/studentApi';



function StudentSignup() {
    const [formData, setFormData] = useState({
        full_name: "",
        mobile: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(formData.password !== formData.confirmPassword) {
            toast.error("Password and Confirm Password do not match 😒")
            return;
        }
        if(formData.password.length < 6) {
            toast.error("Password must be at least 6 characters long 😒");
            return;
        }

        setLoading(true)

        try {
            const res = await studentSignup(formData);
            if (res.data.success) {
                toast.success(`Registration successful! 🎉 Welcome, ${res.data.full_name}! `);
                toast.info(`Your Student ID is ${res.data.student_id}.`)
                setFormData({
                    full_name: "",
                    mobile: "",
                    email: "",
                    password: "",
                    confirmPassword: ""
                })
            }
            else {
                toast.error(res.data.message || "Registration failed 😒")
            }
        }
        catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "An error occurred during registration. Please try again later 😒")
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
                                <i className='fa-solid fa-user-plus text-blue-600 mr-2'></i>
                                Student SignUp
                            </h4>
                            <p className='text-gray-500 text-sm mb-0'>
                                Create your account to access our library resources and manage your book rentals with ease.
                            </p>
                        </div>
                    </div>

                    <div className='grid grid-cols-1 gap-4'>

                        <div className='w-full md:w-1/2 mx-auto'>
                            <div className='bg-white border-0 shadow-sm rounded-2xl'>
                                <div className='p-4 flex flex-col'>

                                    <form onSubmit={handleSubmit} className='flex flex-col flex-grow'>

                                        <div className='mb-4'>
                                            <label className='block text-sm font-semibold mb-1'>
                                                Full Name
                                            </label>
                                            <input
                                                type='text'
                                                name='full_name'
                                                className='w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300'
                                                placeholder='Enter your full name'
                                                required
                                                value={formData.full_name}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        <div className='mb-4'>
                                            <label className='block text-sm font-semibold mb-1'>
                                                Mobile Number
                                            </label>
                                            <input
                                                type='tel'
                                                name='mobile'
                                                className='w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300'
                                                placeholder='Enter your mobile number'
                                                required
                                                value={formData.mobile}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        <div className='mb-4'>
                                            <label className='block text-sm font-semibold mb-1'>
                                                Email
                                            </label>
                                            <input
                                                type='email'
                                                name='email'
                                                className='w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300'
                                                placeholder='Enter your email'
                                                required
                                                value={formData.email}
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

                                        <div className='mb-4'>
                                            <label className='block text-sm font-semibold mb-1'>
                                                Confirm Password
                                            </label>
                                            <input
                                                type='password'
                                                name='confirmPassword'
                                                className='w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300'
                                                placeholder='Confirm your password'
                                                required
                                                value={formData.confirmPassword}
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
                                                        Registering...
                                                    </>
                                                ) : (
                                                    <>
                                                        <i className='fa-solid fa-user-plus mr-2'></i>
                                                        Register Now
                                                    </>
                                                )}
                                            </button>
                                            <p className='text-center text-gray-500 text-sm mt-2'>
                                                Already have an account?{' '}
                                                <Link to='/student/login' className='no-underline text-blue-600 hover:underline'>
                                                    Sign in
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

export default StudentSignup