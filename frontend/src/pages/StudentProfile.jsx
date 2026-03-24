import React, { useState, useEffect } from 'react'
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
import { studentProfile, updateStudentProfile } from '../utils/studentApi';

function StudentProfile() {

    const [profile, setProfile] = useState({
        student_id: "",
        full_name: "",
        email: "",
        mobile: "",
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const studentUser = JSON.parse(localStorage.getItem("studentUser"));

    const navigate = useNavigate();

    useEffect(() => {
        

        const fetchProfile = async () => {
            try {
                setLoading(true);
                const res = await studentProfile();
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
            const res = await updateStudentProfile({
                full_name: profile.full_name,
                mobile: profile.mobile,
            });
            if (res.data?.success) {
                toast.success("Profile updated successfully 😎");
            }
            const updatedUser = {
                ...studentUser,
                full_name: profile.full_name,
                mobile: profile.mobile,
            };
            localStorage.setItem("studentUser", JSON.stringify(updatedUser));
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Failed to update profile 😒")
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <div className='text-center my-10'>
                <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className='mt-3 text-gray-500'>Loading...</p>
            </div>
        );
    }

    return (

        <div className='py-10' style={{ background: "linear-gradient(135deg,#f3f4ff,#fdfbff)", minHeight: "100vh" }}>

            <div className='max-w-7xl mx-auto px-4'>

                <div className='flex items-center gap-3 mb-6'>

                    <span
                        className='inline-flex items-center justify-center rounded-full'
                        style={{ width: "45px", height: "45px", background: "#e0e7ff" }}
                    >
                        <i className='fa-solid fa-user-graduate text-blue-600 text-lg'></i>
                    </span>

                    <div>
                        <h4 className='mb-0 text-xl font-semibold'>My Profile</h4>
                        <p className='text-gray-500 mb-0'>
                            View and update your basic profile details.
                        </p>
                    </div>

                    <p className='text-gray-500 mb-0 ml-auto italic rounded px-2 py-1' style={{ background: "#e0e7ff" }}>
                        Welcome, {studentUser?.full_name || "Student"}!
                    </p>

                </div>

                <div className='flex justify-center'>

                    <div className='w-full md:w-2/3 lg:w-7/12'>

                        <div className='bg-white shadow-sm border-0 rounded-2xl'>

                            <div className='p-4'>

                                <form onSubmit={handleSubmit}>

                                    <div className='mb-4'>
                                        <label htmlFor="student_id" className='block mb-1 text-sm font-medium text-gray-700'>
                                            Student ID
                                        </label>
                                        <input
                                            type='text'
                                            className='w-full border border-gray-300 rounded px-3 py-2 bg-gray-100 focus:outline-none'
                                            value={profile.student_id}
                                            readOnly
                                        />
                                    </div>

                                    <div className='mb-4'>
                                        <label htmlFor="full_name" className='block mb-1 text-sm font-medium text-gray-700'>
                                            Full Name
                                        </label>
                                        <input
                                            type='text'
                                            className='w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300'
                                            name="full_name"
                                            value={profile.full_name}
                                            onChange={handleChangeSubmit}
                                        />
                                    </div>

                                    <div className='mb-4'>
                                        <label htmlFor="email" className='block mb-1 text-sm font-medium text-gray-700'>
                                            Email Address
                                        </label>
                                        <input
                                            type='email'
                                            className='w-full border border-gray-300 rounded px-3 py-2 bg-gray-100 focus:outline-none'
                                            value={profile.email}
                                            readOnly
                                        />
                                    </div>

                                    <div className='mb-6'>
                                        <label htmlFor="mobile" className='block mb-1 text-sm font-medium text-gray-700'>
                                            Mobile Number
                                        </label>
                                        <input
                                            type='text'
                                            className='w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300'
                                            name="mobile"
                                            value={profile.mobile}
                                            onChange={handleChangeSubmit}
                                        />
                                    </div>

                                    <div className='flex justify-end gap-2'>

                                        <button
                                            type='button'
                                            className='border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-4 py-2 rounded transition-colors'
                                            onClick={() => navigate("/user/dashboard")}
                                        >
                                            <i className='fa-solid fa-arrow-left mr-2'></i>
                                            Back
                                        </button>

                                        <button
                                            type='submit'
                                            disabled={saving}
                                            className={`px-4 py-2 rounded text-white transition-colors disabled:opacity-60 ${saving ? "bg-gray-500" : "bg-blue-600 hover:bg-blue-700"}`}
                                        >
                                            {saving ? (
                                                <>
                                                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                                                    Saving...
                                                </>
                                            ) : (
                                                <>
                                                    <i className='fa-solid fa-floppy-disk mr-2'></i>
                                                    Save Changes
                                                </>
                                            )}
                                        </button>

                                    </div>

                                </form>

                            </div>

                        </div>

                        <p className='text-gray-500 mt-3'>
                            Tip: Strong profile details help library staff identify you quickly.
                        </p>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default StudentProfile;