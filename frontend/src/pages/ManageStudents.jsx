import React, { useState, useEffect } from 'react'
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
import { blockStudent, getStudents, unblockStudent } from '../utils/studentApi';

const PAGE_SIZE = 8;


function ManageStudents() {
    const [students, setStudents] = useState([]);
    const [loadingList, setLoadingList] = useState(false);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate();


    const studentsList = Array.isArray(students) ? students : [];

    useEffect(() => {
        fetchStudents(currentPage);
    }, [currentPage, search, statusFilter])

    const fetchStudents = async (page = 1) => {
        setLoadingList(true)
        try {
            const params = {
                page,
                limit: PAGE_SIZE,
            };

            if (search.trim()) {
                params.search = search.trim();
            }

            if (statusFilter === "active") {
                params.status = "active";
            } else if (statusFilter === "blocked") {
                params.status = "blocked";
            }

            const res = await getStudents({ params });
            const studentList = res.data?.results?.students || [];
            const totalCount = res.data?.count || 0;

            setStudents(studentList);
            setTotalPages(Math.max(1, Math.ceil(totalCount / PAGE_SIZE)));
        }
        catch {
            toast.error("Failed to load Students 😒")
        }
        finally {
            setLoadingList(false)
        }
    }

    const handleToggleStatus = async (student) => {
        const isCurrentlyActive = student.is_active;
        const confirmMsg = isCurrentlyActive
            ? `Are you sure you want to block ${student.full_name}?`
            : `Are you sure you want to unblock ${student.full_name}?`;

        if (!window.confirm(confirmMsg)) {
            return;
        }

        try {
            if (isCurrentlyActive) {
                await blockStudent(student.student_id);
            } else {
                await unblockStudent(student.student_id);
            }
            fetchStudents(currentPage);
        }
        catch {
            toast.error("Failed to update student status 😒");
        }
    };

    const changePage = (page) => {
        if (page < 1 || page > totalPages) {
            return;
        }

        setCurrentPage(page);
    }

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
        setCurrentPage(1);
    }

    const handleStatusChange = (e) => {
        setStatusFilter(e.target.value);
        setCurrentPage(1);
    }

    return (
        <div className="py-10" style={{ background: "linear-gradient(135deg,#f3f4ff,#fdfbff)", minHeight: "100vh" }}>

            <div className="w-full px-10">

                <div className="flex justify-between items-center mb-6">

                    <div className="flex items-center gap-3">

                        <span
                            className="inline-flex items-center justify-center rounded-full"
                            style={{ width: "45px", height: "45px", background: "#e0e7ff" }}
                        >
                            <i className="fa-solid fa-users text-blue-600 text-lg"></i>
                        </span>

                        <div>
                            <h4 className="mb-0 text-xl font-semibold">Manage Registered Students</h4>
                            <p className="text-gray-500 mb-0">
                                View all registered students, block/unblock them, and open their book issue history.
                            </p>
                        </div>

                    </div>

                    <button className="border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-4 py-2 rounded transition-colors" onClick={() => navigate("/admin/issued-books")}>
                        <i className="fa-solid fa-list mr-2"></i>
                        Issued Books
                    </button>

                </div>

                {loadingList ? (
                    <div className="flex justify-center items-center" style={{ height: "200px" }}>
                        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div>
                ) : students.length === 0 ? (
                    <div className="text-center py-10">
                        <i className="fa-solid fa-users text-gray-400 text-5xl"></i>
                        <h5 className="mt-3 text-lg font-semibold">No Students Found</h5>
                        <p className="text-gray-500">
                            There are no registered students to display.
                        </p>
                    </div>
                ) : (

                    <div className="bg-white border-0 shadow-sm rounded-2xl">

                        <div className="p-4">

                            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-4">
                                <div className="md:col-span-8">
                                    <input
                                        type="text"
                                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                                        placeholder="Search by student ID, name, email or mobile..."
                                        value={search}
                                        onChange={handleSearchChange}
                                    />
                                </div>
                                <div className="md:col-span-4">
                                    <select
                                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white"
                                        value={statusFilter}
                                        onChange={handleStatusChange}
                                    >
                                        <option value="all">All Status</option>
                                        <option value="active">Active</option>
                                        <option value="blocked">Blocked</option>
                                    </select>
                                </div>
                            </div>

                            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 text-sm text-gray-600">
                                <div>
                                    Showing page {currentPage} of {totalPages}
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        className="border border-gray-300 bg-white px-3 py-1.5 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                                        onClick={() => changePage(currentPage - 1)}
                                        disabled={currentPage <= 1 || loadingList}
                                    >
                                        Previous
                                    </button>
                                    <button
                                        type="button"
                                        className="border border-gray-300 bg-white px-3 py-1.5 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                                        onClick={() => changePage(currentPage + 1)}
                                        disabled={currentPage >= totalPages || loadingList}
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>

                            {studentsList.length === 0 ? (
                                <div className="text-center py-6 text-gray-500">
                                    No students match the selected filters.
                                </div>
                            ) : (

                            <div className="overflow-x-auto">

                                <table className="w-full text-sm [&_td]:align-middle [&_th]:align-middle">

                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="px-4 py-3 text-left font-semibold text-gray-600">#</th>
                                            <th className="px-4 py-3 text-left font-semibold text-gray-600">Student ID</th>
                                            <th className="px-4 py-3 text-left font-semibold text-gray-600">Student Name</th>
                                            <th className="px-4 py-3 text-left font-semibold text-gray-600">Email</th>
                                            <th className="px-4 py-3 text-left font-semibold text-gray-600">Mobile</th>
                                            <th className="px-4 py-3 text-left font-semibold text-gray-600">Reg Date</th>
                                            <th className="px-4 py-3 text-left font-semibold text-gray-600">Status</th>
                                            <th className="px-4 py-3 text-left font-semibold text-gray-600">Action</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {studentsList.map((student, index) => (
                                            <tr key={student.id} className="border-t border-gray-200">

                                                <td className="px-4 py-3">{(currentPage - 1) * PAGE_SIZE + index + 1}</td>
                                                <td className="px-4 py-3">{student.student_id}</td>
                                                <td className="px-4 py-3">{student.full_name}</td>
                                                <td className="px-4 py-3">{student.email}</td>
                                                <td className="px-4 py-3">{student.mobile}</td>
                                                <td className="px-4 py-3">{new Date(student.created_at).toLocaleDateString()}</td>

                                                <td className="px-4 py-3">
                                                    <span
                                                        className={`text-xs font-semibold px-3 py-1 rounded ${student.is_active
                                                            ? "bg-green-100 text-green-700"
                                                            : "bg-red-100 text-red-700"
                                                            }`}
                                                    >
                                                        {student.is_active ? "Active" : "Blocked"}
                                                    </span>
                                                </td>

                                                <td className="px-4 py-3">
                                                    <div className="flex gap-2">

                                                        <button
                                                            className={student.is_active
                                                                ? "border border-red-500 text-red-500 hover:bg-red-500 hover:text-white text-sm px-3 py-1 rounded transition-colors"
                                                                : "border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white text-sm px-3 py-1 rounded transition-colors"}
                                                            onClick={() => handleToggleStatus(student)}
                                                        >
                                                            <i className={student.is_active ? "fa-solid fa-user-slash mr-1" : "fa-solid fa-user-check mr-1"}></i>
                                                            {student.is_active ? "Block" : "Unblock"}
                                                        </button>

                                                        <button
                                                            className="bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-1 rounded transition-colors"
                                                            onClick={() => navigate(`/admin/student-history/${student.student_id}`)}
                                                        >
                                                            <i className="fa-solid fa-circle-info mr-1"></i>
                                                            Details
                                                        </button>

                                                    </div>
                                                </td>

                                            </tr>
                                        ))}
                                    </tbody>

                                </table>

                            </div>
                            )}

                        </div>

                    </div>
                )}

            </div>

        </div>
    )
}

export default ManageStudents