import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"

function StudentProfile() {

    const [profile, setProfile] = useState({
        student_id: "",
        full_name: "",
        email: "",
        mobile: "",
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const navigate = useNavigate();
    const studentUser = JSON.parse(localStorage.getItem("studentUser"));

    useEffect(() => {

        if (!studentUser) {
            toast.error("Please login to access the dashboard 😒");
            navigate("/user/login");
            return;
        }

        const fetchProfile = async () => {

            try {

                setLoading(true);

                const res = await axios.get(
                    "http://127.0.0.1:8000/api/user/profile/",
                    {
                        params: { student_id: studentUser.student_id },
                    }
                );

                setProfile({
                    student_id: res.data.student.student_id,
                    full_name: res.data.student.full_name,
                    email: res.data.student.email,
                    mobile: res.data.student.mobile,
                });

            } catch (err) {

                console.error(err);
                toast.error("Failed to fetch profile 😒");

            } finally {
                setLoading(false);
            }

        };

        fetchProfile();

    }, []);


    const handleChangeSubmit = (e) => {

        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));

    }


    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            setSaving(true);

            await axios.put(
                "http://127.0.0.1:8000/api/user/profile/",
                {
                    student_id: profile.student_id,
                    full_name: profile.full_name,
                    mobile: profile.mobile,
                }
            );

            toast.success("Profile updated successfully 😎");

            const updatedUser = {
                ...studentUser,
                full_name: profile.full_name,
            };

            localStorage.setItem("studentUser", JSON.stringify(updatedUser));

        } catch (err) {

            console.error(err);
            toast.error( err.response?.data?.message ||
        "Failed to update profile 😒")

        } finally {

            setSaving(false);

        }

    }


    if (loading) {
        return (
            <div className='text-center my-5'>
                <div className="spinner-border text-primary"></div>
                <p className='mt-3 text-muted'>Loading...</p>
            </div>
        );
    }


    return (

        <div className='py-5' style={{ background: "linear-gradient(135deg,#f3f4ff,#fdfbff)", minHeight: "100vh" }}>

            <div className='container'>

                {/* Header */}

                <div className='d-flex align-items-center gap-3 mb-4'>

                    <span
                        className='d-inline-flex align-items-center justify-content-center rounded-circle'
                        style={{ width: "45px", height: "45px", background: "#e0e7ff" }}
                    >
                        <i className='fa-solid fa-user-graduate text-primary fs-5'></i>
                    </span>

                    <div>
                        <h4 className='mb-0'>My Profile</h4>
                        <p className='text-muted mb-0'>
                            View and update your basic profile details.
                        </p>
                    </div>
                    <p className='text-muted mb-0 ms-auto fst-italic rounded px-2 py-1' style={{ background: "#e0e7ff" }}>
                        Welcome, {studentUser.full_name}!
                    </p>

                </div>


                <div className='row justify-content-center'>

                    <div className='col-md-8 col-lg-7'>

                        <div className='card shadow-sm border-0 rounded-4'>

                            <div className='card-body p-4'>

                                <form onSubmit={handleSubmit}>

                                    {/* Student ID */}

                                    <div className='mb-3'>

                                        <label htmlFor="student_id" className='form-label'>
                                            Student ID
                                        </label>

                                        <input
                                            type='text'
                                            className='form-control bg-light'
                                            value={profile.student_id}
                                            readOnly
                                        />

                                    </div>


                                    {/* Full Name */}

                                    <div className='mb-3'>

                                        <label htmlFor="full_name" className='form-label'>
                                            Full Name
                                        </label>

                                        <input
                                            type='text'
                                            className='form-control'
                                            name="full_name"
                                            value={profile.full_name}
                                            onChange={handleChangeSubmit}
                                        />

                                    </div>


                                    {/* Email */}

                                    <div className='mb-3'>

                                        <label htmlFor="email" className='form-label'>
                                            Email Address
                                        </label>

                                        <input
                                            type='email'
                                            className='form-control bg-light'
                                            value={profile.email}
                                            readOnly
                                        />

                                    </div>


                                    {/* Mobile */}

                                    <div className='mb-4'>

                                        <label htmlFor="mobile" className='form-label'>
                                            Mobile Number
                                        </label>

                                        <input
                                            type='text'
                                            className='form-control'
                                            name="mobile"
                                            value={profile.mobile}
                                            onChange={handleChangeSubmit}
                                        />

                                    </div>


                                    {/* Buttons */}

                                    <div className='d-flex justify-content-end gap-2'>

                                        <button
                                            type='button'
                                            className='btn btn-outline-primary'
                                            onClick={() => navigate("/user/dashboard")}
                                        >
                                            <i className='fa-solid fa-arrow-left me-2'></i>
                                            Back
                                        </button>


                                        <button
                                            type='submit'

                                            disabled={saving}
                                            className={`btn ${saving ? "btn-secondary" : "btn-primary"} w-100px`}
                                        >

                                            {saving ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                                    Saving...
                                                </>
                                            ) : (
                                                <>
                                                    <i className='fa-solid fa-floppy-disk me-2'></i>
                                                    Save Changes
                                                </>
                                            )}

                                        </button>

                                    </div>

                                </form>

                            </div>

                        </div>


                        <p className='text-muted mt-3'>
                            Tip: Strong profile details help library staff identify you quickly.
                        </p>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default StudentProfile;