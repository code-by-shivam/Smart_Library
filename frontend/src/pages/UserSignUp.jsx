import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from "react-toastify"
import { Link, useNavigate } from "react-router-dom"

function UserSignUp() {
    const [formData, setFormData] = useState({
        full_name: "",
        mobile: "",
        email: "",
        password: "",
        confirmPassword: ""
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
            const res = await axios.post("http://127.0.0.1:8000/api/user/user_signup/",formData);
            if (res.data.success) {
                toast.success(`Registration successful! Welcome, ${res.data.full_name} 🎉`) ;
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
            toast.error( err.response?.data?.message || "An error occurred during registration. Please try again later 😒")
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
                                <i className='fa-solid fa-user-plus text-primary me-2'></i>
                               User SignUp
                            </h4>
                            <p className='text-muted small mb-0'>
                                Create your account to access our library resources and manage your book rentals with ease.
                            </p>
                        </div>
                    </div>

                    <div className='row g-4'>

                        {/* Add Author Form */}
                        <div className='col-md-6 mx-auto'>
                            <div className='card border-0 shadow-sm rounded-4 h-60'>
                                <div className='card-body p-4 d-flex flex-column'>

                                    <form onSubmit={handleSubmit} className='d-flex flex-column flex-grow-1'>

                                        <div className='mb-3'>
                                            <label className='form-label small fw-semibold mb-1'>
                                                Full Name
                                            </label>
                                                <input
                                                type='text'
                                                name='full_name'
                                                className='form-control form-control-sm'
                                                placeholder='Enter your full name'
                                                required
                                                value={formData.full_name}
                                                onChange={handleChange}
                                            />

                                        
                                        </div>
                                        <div className='mb-3'>
                                            <label className='form-label small fw-semibold mb-1'>
                                                Mobile Number
                                            </label>
                                        
                    
                                                <input
                                                type='tel'
                                                name='mobile'
                                                className='form-control form-control-sm'
                                                placeholder='Enter your mobile number'
                                                required
                                                value={formData.mobile}
                                                onChange={handleChange}
                                            />

                                        
                                        </div>

                                        <div className='mb-3'>
                                            <label className='form-label small fw-semibold mb-1'>
                                                Email
                                            </label>
                                                <input
                                                type='email'
                                                name='email'
                                                className='form-control form-control-sm'
                                                placeholder='Enter your email'
                                                required
                                                value={formData.email}
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

                                        <div className='mb-3'>
                                            <label className='form-label small fw-semibold mb-1'>
                                                Confirm Password
                                            </label>
                                                <input
                                                type='password'
                                                name='confirmPassword'
                                                className='form-control form-control-sm'
                                                placeholder='Confirm your password'
                                                required
                                                value={formData.confirmPassword}
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
                                                        Registering...
                                                    </>
                                                ) : (
                                                    <>
                                                        <i className='fa-solid fa-user-plus me-2'></i>
                                                     Register Now
                                                    </>
                                                )}
                                            </button>
                                            <p className='text-center text-muted small mt-2'>
                                                Already have an account?
                                                <Link to='/user/login' className='text-decoration-none'>
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

export default UserSignUp
//  import React from 'react'
 
//  function UserSignUp() {
//    return (
//      <div>UserSignUp</div>
//    )
//  }
 
//  export default UserSignUp