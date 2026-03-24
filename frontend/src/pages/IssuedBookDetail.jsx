import React, { useEffect, useState } from 'react'
import { toast } from "react-toastify"
import { useNavigate, useParams } from "react-router-dom"
import { getIssuedBookDetails, returnBook } from '../utils/issuedApi'


function IssuedBookDetail() {
    const { id } = useParams()
    const [issueDetails, setIssueDetails] = useState(null)
    const [fine, setFine] = useState("")
    const [loading, setLoading] = useState(false)
    const [returning, setReturning] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {


        const fetchIssueDetails = async () => {
            setLoading(true)

            try {
                const res = await getIssuedBookDetails(id);
                setIssueDetails(res.data.issued_book)
                if (res.data.issued_book.fine) {
                    setFine(res.data.issued_book.fine)
                }
            } catch (err) {
                toast.error("Failed to load issued book details")
                console.error(err)
            } finally {
                setLoading(false)
            }
        }

        fetchIssueDetails()
    }, [id])

    const handleReturnBook = async () => {
        if (!window.confirm("Are you sure you want to return this book?")) {
            return
        }

        if (fine === "" || fine === null || fine === undefined) {
            toast.error("Please enter a fine amount (enter 0 if no fine)")
            return
        }

        setReturning(true)

        try {
            await returnBook(id, {fine: fine});
            toast.success("Book returned successfully!")
            navigate("/admin/issued-books")
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to return book")
        } finally {
            setReturning(false)
        }
    }

    

    if (loading) {
        return (
            <div
                className='py-5 flex justify-center items-center'
                style={{
                    background: "linear-gradient(135deg,#f3f4ff,#fdfbff)",
                    minHeight: "100vh"
                }}
            >
                <div className='w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin'></div>
            </div>
        )
    }

    return (
        <div className="py-5 bg-gray-100" style={{ minHeight: "100vh" }}>
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h4 className="text-xl font-bold mb-1">
                            <i className="fa-solid fa-file-lines mr-2 text-blue-600"></i>
                            Issued Book Details
                        </h4>
                        <p className="text-gray-500 mb-0">
                            View student and book details, and mark this book as returned.
                        </p>
                    </div>

                    <button
                        className="inline-flex items-center border border-blue-600 text-blue-600 px-4 py-2 rounded hover:bg-blue-50 transition-colors"
                        onClick={() => navigate("/admin/issued-books")}
                    >
                        <i className="fa-solid fa-arrow-left mr-2"></i>
                        Back to List
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <div className="bg-white border-0 shadow-sm rounded-2xl mb-3">
                            <div className="p-4">
                                <h5 className="font-semibold mb-3">Student Details</h5>
                                <hr />

                                <p className='mb-1'><strong>Student ID :</strong> {issueDetails?.student_id}</p>
                                <p className='mb-1'><strong>Student Name :</strong> {issueDetails?.student_name}</p>

                                <p>
                                    <strong>Fine :</strong>{" "}
                                    {issueDetails?.fine ? `Rs ${issueDetails.fine}` : "No fine recorded yet"}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="bg-white border-0 shadow-sm rounded-2xl mb-3">
                            <div className="p-4">
                                <h5 className="font-semibold mb-3">Book Details</h5>
                                <hr />

                                <div className="flex gap-3">
                                    {issueDetails?.book_cover_image && (
                                        <img
                                            src={issueDetails.book_cover_image}
                                            alt="book"
                                            className="rounded border shadow-sm p-1 my-auto"
                                            style={{ width: "100px", height: "120px", objectFit: "cover", borderRadius: "4px" }}
                                        />
                                    )}

                                    <div>
                                        <p><strong>Book Name :</strong> {issueDetails?.book_title}</p>
                                        <p><strong>ISBN :</strong> {issueDetails?.book_isbn}</p>

                                        <p>
                                            <strong>Issued Date :</strong>{" "}
                                            {issueDetails?.issued_at && new Date(issueDetails.issued_at).toLocaleString()}
                                        </p>
                                        <p>
                                            <strong>Due Date :</strong>{" "}
                                            {issueDetails?.due_date && new Date(issueDetails.due_date).toLocaleString()}
                                        </p>

                                        <p>
                                            <strong>Returned Date :</strong>{" "}
                                            {issueDetails?.returned_at
                                                ? new Date(issueDetails.returned_at).toLocaleString()
                                                : "Not Returned Yet"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white border-0 rounded-2xl shadow-sm">
                            <div className="p-4">
                                <h5 className="font-semibold mb-3">Return / Fine</h5>
                                <hr />

                                {issueDetails?.is_returned ? (
                                    <div className="text-green-600">
                                        This book has already been returned. Fine: Rs {issueDetails.fine}
                                    </div>
                                ) : (
                                    <>
                                        <div className="mb-3">
                                            <label className="block text-sm font-medium mb-1">Fine (Rs)</label>
                                            <input
                                                type="number"
                                                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="Enter fine amount e.g. 50"
                                                value={fine}
                                                onChange={(e) => setFine(e.target.value)}
                                            />
                                        </div>

                                        <button
                                            className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors disabled:opacity-60"
                                            onClick={handleReturnBook}
                                            disabled={returning}
                                        >
                                            {returning ? (
                                                <>
                                                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                                                    Processing...
                                                </>
                                            ) : (
                                                <>
                                                    <i className="fa-solid fa-rotate-left mr-2"></i>
                                                    Return Book
                                                </>
                                            )}
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default IssuedBookDetail