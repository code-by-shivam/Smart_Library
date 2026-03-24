import React, { useState, useEffect } from 'react'
import { toast } from "react-toastify"
import { Link } from "react-router-dom"
import { studentStats } from '../utils/studentApi';

function StudentDashboard() {
    const [states, setStates] = useState({
        total_books: 0,
        total_issued: 0,
        pending_returns: 0,
    });
    const [loading, setLoading] = useState(true);

const studentUser = JSON.parse(localStorage.getItem("studentUser"));
    useEffect(() => {
       

        const fetchStats = async () => {
            try {
                setLoading(true);
                const res = await studentStats();
                setStates(res.data.stats);
            } catch (err) {
                console.error(err);
                toast.error("Failed to fetch dashboard data 😒");
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    return (
        <>
            <div className='py-10' style={{ background: "linear-gradient(135deg,#f3f4ff,#fdfbff)", minHeight: "100vh" }}>
                <div className='max-w-7xl mx-auto px-4'>
                    <div className='flex flex-wrap justify-between items-center'>
                        <div>
                            <h3 className='mb-1 flex items-center gap-2 text-2xl font-semibold'>
                                <span
                                    className='inline-flex items-center justify-center rounded-full'
                                    style={{ width: "40px", height: "40px", background: "#e0e7ff" }}
                                >
                                    <i className='fa-solid fa-user-graduate text-blue-600' />
                                </span>
                                <span>My Library Dashboard</span>
                            </h3>
                            <p className='text-gray-500'>Manage your library activities and view your reading statistics.</p>
                        </div>
                        <div>
                            <p className='mt-3 rounded-full bg-gray-500 text-white py-2 px-4 inline-block'>
                                Welcome {studentUser?.full_name || "Guest"}
                            </p>
                        </div>
                    </div>

                    {loading && (
                        <div className='text-center my-10'>
                            <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" role="status"></div>
                            <p className="mt-3 text-gray-500">Loading...</p>
                        </div>
                    )}

                    {!loading && (
                        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>

                            <div>
                                <div className='bg-white border-0 shadow-sm rounded h-full'>
                                    <div className='p-4 flex flex-col'>
                                        <div className='flex justify-between items-center mb-3'>
                                            <div>
                                                <h6 className='uppercase text-gray-500 text-xs font-semibold mb-1'>Total Books</h6>
                                                <h3 className='mb-0 text-2xl font-bold'>{states.total_books}</h3>
                                            </div>
                                            <div
                                                className='rounded-full flex items-center justify-center'
                                                style={{ width: "40px", height: "40px", background: "#e0e7ff" }}
                                            >
                                                <i className='fa-solid fa-layer-group text-blue-600' />
                                            </div>
                                        </div>
                                        <p className='text-gray-500 text-sm mb-0'>All books currently available in the library catalogue.</p>
                                        <div className='mt-3'>
                                            <Link to="/student/books" className='text-sm text-blue-600'>
                                                View Books <i className='fa-solid fa-arrow-right ml-2' />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div
                                    className='border-0 shadow-sm rounded h-full'
                                    style={{
                                        background: "linear-gradient(135deg,#f97316,#f97316cc,#f59e0b)",
                                        color: "#fff"
                                    }}
                                >
                                    <div className='p-4 flex flex-col'>
                                        <div className='flex justify-between items-center mb-3'>
                                            <div>
                                                <h6 className='uppercase text-gray-500 text-xs font-semibold mb-1'>Pending Returns</h6>
                                                <h3 className='mb-0 text-2xl font-bold'>{states.pending_returns}</h3>
                                            </div>
                                            <div
                                                className='rounded-full flex items-center justify-center'
                                                style={{ width: "40px", height: "40px", background: "#e0e7ff" }}
                                            >
                                                <i className='fa-solid fa-clock text-blue-600' />
                                            </div>
                                        </div>
                                        <p className='text-gray-500 text-sm mb-0'>Books that are currently checked out and awaiting return.</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div className='bg-white border-0 shadow-sm rounded h-full'>
                                    <div className='p-4 flex flex-col'>
                                        <div className='flex justify-between items-center mb-3'>
                                            <div>
                                                <h6 className='uppercase text-gray-500 text-xs font-semibold mb-1'>Total Books Issued</h6>
                                                <h3 className='mb-0 text-2xl font-bold'>{states.total_issued}</h3>
                                            </div>
                                            <div
                                                className='rounded-full flex items-center justify-center'
                                                style={{ width: "40px", height: "40px", background: "#e0e7ff" }}
                                            >
                                                <i className='fa-solid fa-layer-group text-blue-600' />
                                            </div>
                                        </div>
                                        <p className='text-gray-500 text-sm mb-0'>Books that have been issued to students.</p>
                                        <div className='mt-3'>
                                            <Link to="/student/issue-history" className='text-sm text-blue-600'>
                                                View issue history <i className='fa-solid fa-arrow-right ml-2' />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default StudentDashboard