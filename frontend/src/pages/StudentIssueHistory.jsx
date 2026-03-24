import React, { useState, useEffect } from 'react'
import { toast } from "react-toastify"
import { studentIssueHistory } from '../utils/studentApi';

const PAGE_SIZE = 8;


function StudentIssueHistory() {

    const [loading, setLoading] = useState(false);
    const [issuedBooks, setIssuedBooks] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [summary, setSummary] = useState({
        total_issued: 0,
        returned_count: 0,
        pending_count: 0,
        total_fine: 0,
    });


    useEffect(() => {
        const fetchIssuedBooks = async () => {
            setLoading(true);
            try {
                const res = await studentIssueHistory({
                    page: currentPage,
                    limit: PAGE_SIZE,
                });
                setIssuedBooks(res.data?.results?.history || []);
                setSummary(res.data?.results?.summary || {
                    total_issued: 0,
                    returned_count: 0,
                    pending_count: 0,
                    total_fine: 0,
                });
                const totalCount = res.data?.count || 0;
                setTotalPages(Math.max(1, Math.ceil(totalCount / PAGE_SIZE)));
            } catch (err) {
                console.error(err);
                toast.error("Failed to fetch issued books");
            } finally {
                setLoading(false);
            }
        };

        fetchIssuedBooks();
    }, [currentPage]);

    const changePage = (page) => {
        if (page < 1 || page > totalPages) {
            return;
        }

        setCurrentPage(page);
    };

    const totalissued = summary.total_issued;
    const returnedCount = summary.returned_count;
    const notReturnedCount = summary.pending_count;
    const totalfine = summary.total_fine;

    return (
        <div className="py-10" style={{ background: "linear-gradient(135deg,#f3f4ff,#fdfbff)", minHeight: "100vh" }}>
            <div className="max-w-7xl mx-auto px-4">

                <div className="mb-6">
                    <h3 className="font-bold flex items-center gap-2 text-2xl">
                        <div
                            className="flex items-center justify-center rounded-lg"
                            style={{
                                width: "45px",
                                height: "45px",
                                background: "#e0e7ff",
                                color: "#2563eb"
                            }}
                        >
                            <i className="fa-solid fa-book"></i>
                        </div>
                        My Issued Books
                    </h3>
                    <p className="text-gray-500 mb-0">
                        Track all books you have issued along with return status and fines.
                    </p>
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
                            disabled={currentPage <= 1 || loading}
                        >
                            Previous
                        </button>
                        <button
                            type="button"
                            className="border border-gray-300 bg-white px-3 py-1.5 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={() => changePage(currentPage + 1)}
                            disabled={currentPage >= totalPages || loading}
                        >
                            Next
                        </button>
                    </div>
                </div>

                {loading && (
                    <div className="text-center my-10">
                        <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-gray-500 mt-2">Loading...</p>
                    </div>
                )}

                {!loading && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

                            <div>
                                <div className="bg-white border-0 shadow-sm rounded-2xl p-3">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="text-gray-500 text-sm mb-1">TOTAL ISSUED</p>
                                            <h4 className="font-bold text-2xl">{totalissued}</h4>
                                        </div>
                                        <div className="bg-gray-100 p-3 rounded">
                                            <i className="fa-solid fa-book text-blue-600"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div className="bg-white border-0 shadow-sm rounded-2xl p-3">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="text-gray-500 text-sm mb-1">NOT RETURNED YET</p>
                                            <h4 className="font-bold text-2xl text-yellow-500">{notReturnedCount}</h4>
                                        </div>
                                        <div className="bg-gray-100 p-3 rounded">
                                            <i className="fa-solid fa-clock text-yellow-500"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div className="bg-white border-0 shadow-sm rounded-2xl p-3">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="text-gray-500 text-sm mb-1">TOTAL FINE (₹)</p>
                                            <h4 className="font-bold text-2xl text-red-500">₹ {totalfine}</h4>
                                        </div>
                                        <div className="bg-gray-100 p-3 rounded">
                                            <i className="fa-solid fa-indian-rupee-sign text-red-500"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>

                        <div className="bg-white border-0 shadow-sm rounded-2xl">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm [&_td]:align-middle [&_th]:align-middle mb-0">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="px-4 py-3 text-left font-semibold text-gray-600">#</th>
                                            <th className="px-4 py-3 text-left font-semibold text-gray-600">Book Name</th>
                                            <th className="px-4 py-3 text-left font-semibold text-gray-600">ISBN</th>
                                            <th className="px-4 py-3 text-left font-semibold text-gray-600">Issued Date</th>
                                            <th className="px-4 py-3 text-left font-semibold text-gray-600">Return Date</th>
                                            <th className="px-4 py-3 text-left font-semibold text-gray-600">Fine (₹)</th>
                                            <th className="px-4 py-3 text-left font-semibold text-gray-600">Status</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {issuedBooks.length === 0 ? (
                                            <tr>
                                                <td colSpan="7" className="text-center py-6 text-gray-500">
                                                    No issued books found
                                                </td>
                                            </tr>
                                        ) : (
                                            issuedBooks.map((book, index) => (
                                                <tr key={book.id} className="border-t border-gray-200">
                                                    <td className="px-4 py-3">{(currentPage - 1) * PAGE_SIZE + index + 1}</td>

                                                    <td className="px-4 py-3">{book.book_title}</td>

                                                    <td className="px-4 py-3">
                                                        <span className="bg-gray-100 text-gray-800 text-xs font-semibold px-2 py-1 rounded">
                                                            {book.book_isbn}
                                                        </span>
                                                    </td>

                                                    <td className="px-4 py-3">
                                                        {new Date(book.issued_at).toLocaleString()}
                                                    </td>

                                                    <td className="px-4 py-3">
                                                        {book.is_returned ? (
                                                            new Date(book.returned_at).toLocaleString()
                                                        ) : (
                                                            <span className="text-red-500 font-semibold">
                                                                Not returned yet
                                                            </span>
                                                        )}
                                                    </td>

                                                    <td className="px-4 py-3">₹ {book.fine}</td>

                                                    <td className="px-4 py-3">
                                                        {book.is_returned ? (
                                                            <span className="bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded">Returned</span>
                                                        ) : (
                                                            <span className="bg-yellow-400 text-gray-800 text-xs font-semibold px-2 py-1 rounded">
                                                                Pending
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default StudentIssueHistory