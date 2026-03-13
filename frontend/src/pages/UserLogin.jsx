import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from "react-toastify"
import { Link, Navigate, useNavigate } from "react-router-dom"

function UserLogin() {
    const [formData, setFormData] = useState({
        login_id: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
const navigate=useNavigate();

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
            const res = await axios.post("http://127.0.0.1:8000/api/user/user_login/", formData);
            if (res.data.success) {
                localStorage.setItem("studentUser", JSON.stringify(res.data));
                navigate("/user/dashboard");
                toast.success(`Welcome back, ${res.data.full_name}! 🎉 (Student ID: ${res.data.student_id})`);
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
                                <i className='fa-solid fa-user text-primary me-2'></i>
                                User Login
                            </h4>
                            <p className='text-muted small mb-0'>
                                Please enter your login credentials to access your account and explore our library resources.
                            </p>
                        </div>
                    </div>

                    <div className='row g-4'>

                        {/* Add Author Form */}
                        <div className='col-md-5 mx-auto'>
                            <div className='card border-0 shadow-sm rounded-4 h-60'>
                                <div className='card-body p-4 d-flex flex-column'>

                                    <form onSubmit={handleSubmit} className='d-flex flex-column flex-grow-1'>

                                        <div className='mb-3'>
                                            <label className='form-label small fw-semibold mb-1'>
                                                Email or Student ID
                                            </label>
                                            <input
                                                type='text'
                                                name='login_id'
                                                className='form-control form-control-sm'
                                                placeholder='Enter your email or student ID'
                                                required
                                                value={formData.login_id}
                                                onChange={handleChange}
                                            />


                                        </div>
                                        
                                        

                                        <div className='mb-3'>
                                            <label className='form-label small fw-semibold mb-1'>
                                                Password
                                            </label>
                                            <input
                                                type='password'
                                                name='password'
                                                className='form-control form-control-sm'
                                                placeholder='Enter your password'
                                                required
                                                value={formData.password}
                                                onChange={handleChange}
                                            />


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
                                                        Logging in...
                                                    </>
                                                ) : (
                                                    <>
                                                        <i className='fa-solid fa-user-plus me-2'></i>
                                                        Login
                                                    </>
                                                )}
                                            </button>
                                            <p className='text-center text-muted small mt-2'>
                                                If you don't have an account, please {''}
                                                <Link to='/user/signup' className='text-decoration-none'>
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

export default UserLogin
