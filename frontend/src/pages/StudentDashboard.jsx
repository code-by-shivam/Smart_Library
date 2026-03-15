import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from "react-toastify"
import { Link, useNavigate } from "react-router-dom"

function UserDashboard() {
    const [states, setStates] = useState({
        total_books: 0,
        total_issued: 0,
        pending_returns: 0,
    });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const studentUser = JSON.parse(localStorage.getItem("studentUser"));

    useEffect(() => {
        if (!studentUser) {
            toast.error("Please login to access the dashboard 😒");
            navigate("/user/login");
            return;
        }
        const fetchStats = async () => {
            try {
                setLoading(true);
                const res = await axios.get("http://127.0.0.1:8000/api/user/stats/", {
                    params: { student_id: studentUser.student_id },
                });
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
            <div className='py-5' style={{ background: "linear-gradient(135deg,#f3f4ff,#fdfbff)", minHeight: "100vh" }}>
                <div className='container'>
                    <div className='d-flex flex-wrap justify-content-between align-items-center'>
                        <div>
                            <h3 className='mb-1 d-flex align-items-center gap-2'>
                                <span
                                    className='d-inline-flex align-items-center justify-content-center rounded-3 border border-2'
                                    style={{ width: "40px", height: "40px", background: "#e0e7ff" }}
                                >
                                    <i className='fa-solid fa-user-graduate text-primary' />
                                </span>
                                <span>My Library Dashboard</span>
                            </h3>
                            <p className='text-muted'>Manage your library activities and view your reading statistics.</p>
                        </div>
                        <div>
                            <p className='mt-3 rounded-pill bg-secondary text-white py-2 px-4 d-inline-block'>
                                Welcome {studentUser?.full_name || "Guest"}
                            </p>
                        </div>
                    </div>

                    {loading && (
                        <div className='text-center my-5'>
                            <div className="spinner-border text-primary" role="status">
                                <span className="mt-3 text-muted">Loading...</span>
                            </div>
                        </div>
                    )}

                    {!loading && (
                        <div className='row g-4 mb-4'>
                            {/* Total Books */}
                            <div className='col-md-4'>
                                <div className='card border-0 shadow-sm h-100'>
                                    <div className='card-body d-flex flex-column'>
                                        <div className='d-flex justify-content-between align-items-center mb-3'>
                                            <div>
                                                <h6 className='text-uppercase text-muted card-title mb-1 small'>Total Books</h6>
                                                <h3 className='mb-0'>{states.total_books}</h3>
                                            </div>
                                            <div
                                                className='rounded-circle d-flex align-items-center justify-content-center'
                                                style={{ width: "40px", height: "40px", background: "#e0e7ff" }}
                                            >
                                                <i className='fa-solid fa-layer-group text-primary' />
                                            </div>
                                        </div>
                                        <p className='text-muted small mb-0'>All books currently available in the library catalogue.</p>
                                        <div className='mt-3'>
                                            <Link to="/user/books" className='small text-primary'>
                                                View Books <i className='fa-solid fa-arrow-right ms-2' />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Pending Returns */}
                            <div className='col-md-4'>
                                <div
                                    className='card border-0 shadow-sm h-100'
                                    style={{
                                        background: "linear-gradient(135deg,#f97316,#f97316cc,#f59e0b)",
                                        color: "#fff"
                                    }}
                                >
                                    <div className='card-body d-flex flex-column'>
                                        <div className='d-flex justify-content-between align-items-center mb-3'>
                                            <div>
                                                <h6 className='text-uppercase text-muted card-title mb-1 small'>Pending Returns</h6>
                                                <h3 className='mb-0'>{states.pending_returns}</h3>
                                            </div>
                                            <div
                                                className='rounded-circle d-flex align-items-center justify-content-center'
                                                style={{ width: "40px", height: "40px", background: "#e0e7ff" }}
                                            >
                                                <i className='fa-solid fa-clock text-primary' />
                                            </div>
                                        </div>
                                        <p className='text-muted small mb-0'>Books that are currently checked out and awaiting return.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Total Issued */}
                            <div className='col-md-4'>
                                <div className='card border-0 shadow-sm h-100'>
                                    <div className='card-body d-flex flex-column'>
                                        <div className='d-flex justify-content-between align-items-center mb-3'>
                                            <div>
                                                <h6 className='text-uppercase text-muted card-title mb-1 small'>Total Books Issued</h6>
                                                <h3 className='mb-0'>{states.total_issued}</h3>
                                            </div>
                                            <div
                                                className='rounded-circle d-flex align-items-center justify-content-center'
                                                style={{ width: "40px", height: "40px", background: "#e0e7ff" }}
                                            >
                                                <i className='fa-solid fa-layer-group text-primary' />
                                            </div>
                                        </div>
                                        <p className='text-muted small mb-0'>Books that have been issued to students.</p>
                                        <div className='mt-3'>
                                            <Link to="/users/books" className='small text-primary'>
                                                View issue history <i className='fa-solid fa-arrow-right ms-2' />
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

export default UserDashboard