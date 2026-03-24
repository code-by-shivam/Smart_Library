import React, { useState, useEffect } from 'react'
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
import { getIssuedBooks } from '../utils/issuedApi';

const PAGE_SIZE = 8;


function ManageIssuedBook() {
    const [issue, setIssue] = useState([]);
    const [loadingList, setLoadingList] = useState(false);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate();

    const issuedList = Array.isArray(issue) ? issue : [];

    useEffect(() => {

        fetchIssue(currentPage);
    }, [currentPage, search, statusFilter])

    const fetchIssue = async (page = 1) => {
        setLoadingList(true)
        try {
            const params = {
                page,
                limit: PAGE_SIZE,
            };

            if (search.trim()) {
                params.search = search.trim();
            }

            if (statusFilter === "returned") {
                params.status = "returned";
            } else if (statusFilter === "not_returned") {
                params.status = "pending";
            }

            const res = await getIssuedBooks({ params });
            const issuedBooks = res.data?.results?.issued_books || [];
            const totalCount = res.data?.count || 0;

            setIssue(issuedBooks);
            setTotalPages(Math.max(1, Math.ceil(totalCount / PAGE_SIZE)));
        }
        catch {
            toast.error("Failed to load Issued Books 😒")
        }
        finally {
            setLoadingList(false)
        }
    }

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
        
        <div className="py-10 bg-gray-100" style={{ minHeight: "100vh" }}>
              <div className="max-w-7xl mx-auto px-4">

                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h4 className="text-xl font-bold mb-1">
                            <i className="fa-solid fa-list-check mr-2 text-blue-600"></i>
                            Manage Issued Books
                        </h4>
                        <p className="text-gray-500 mb-0">
                            Track all issued books and update return/fine details.
                        </p>
                    </div>

                    <button
                        className="border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-4 py-2 rounded transition-colors"
                        onClick={() => navigate("/admin/issue-book")}
                    >
                        <i className="fa-solid fa-plus mr-2"></i>
                        Issue New Book
                    </button>
                </div>

               
                <div className="bg-white rounded shadow-sm border-0">
                    
                    <div className="p-4">

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-4">
                            
                            <div className="md:col-span-8">
                                
                                <input
                                    type="text"
                                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                                    placeholder="Search by student, book or ISBN..."
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
                                    <option value="returned">Returned</option>
                                    <option value="not_returned">Not Returned</option>
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

                        {loadingList ? (
                            <div className="text-center py-8">
                                <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                            ) : issuedList.length === 0 ? (
                            <div className="text-center text-gray-500 py-8">
                                No issued books match the selected filters
                            </div>
                        ) : (

                            <div className="overflow-x-auto">
                                <table className="w-full text-sm [&_td]:align-middle [&_th]:align-middle">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="px-4 py-3 text-left font-semibold text-gray-600">#</th>
                                            <th className="px-4 py-3 text-left font-semibold text-gray-600">Student Name</th>
                                            <th className="px-4 py-3 text-left font-semibold text-gray-600">Book Name</th>
                                            <th className="px-4 py-3 text-left font-semibold text-gray-600">ISBN</th>
                                            <th className="px-4 py-3 text-left font-semibold text-gray-600">Issued Date</th>
                                            <th className="px-4 py-3 text-left font-semibold text-gray-600">Return Date</th>
                                            <th className="px-4 py-3 text-left font-semibold text-gray-600">Action</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {issuedList.map((item, index) => (
                                            <tr key={item.id} className="border-t border-gray-200">
                                                <td className="px-4 py-3">{index + 1}</td>

                                                <td className="px-4 py-3">{item.student_name}</td>

                                                <td className="px-4 py-3">{item.book_title}</td>

                                                <td className="px-4 py-3">{item.book_isbn}</td>

                                                <td className="px-4 py-3">
                                                    {new Date(item.issued_at).toLocaleDateString()}
                                                </td>

                                                <td className="px-4 py-3">
                                                    {item.returned_at
                                                        ? new Date(item.returned_at).toLocaleString()
                                                        : (
                                                            <span className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                                                                Not Returned
                                                            </span>
                                                        )}
                                                </td>

                                                <td className="px-4 py-3">
                                                    <button
                                                        className="border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white text-sm px-3 py-1 rounded transition-colors mr-2"
                                                        onClick={() => navigate(`/admin/issued/book/details/${item.id}`)}
                                                    >
                                                        <i className="fa-solid fa-pen-to-square mr-1"></i>
                                                        Details / Return
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                        )}

                    </div>
                </div>

            </div>
        </div>
    )
}

export default ManageIssuedBook