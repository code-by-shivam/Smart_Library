import React, { useState } from 'react'
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
import { getStudentById } from '../utils/studentApi'
import { getBooklookup } from '../utils/bookApi'
import { issueBook } from '../utils/issuedApi'



const IssuedBook = () => {
    const [studentId, setStudentId] = useState("")
    const [student, setStudent] = useState(null)
    const [bookQuery, setBookQuery] = useState("")
    const [book, setBook] = useState(null)
    const [remark, setRemark] = useState("")
    const [studentloading, setStudentloading] = useState(false)
    const [bookloading, setBookLoading] = useState(false)
    const [issuing, setIssuing] = useState(false)
    const [dueDate, setDueDate] = useState("")
    const navigate = useNavigate()


    const handleFetchStudent = async () => {
        if (!studentId) {
            toast.error("Please enter student Id")
            return
        }

        setStudent(null)
        setStudentloading(true)

        try {
            const res = await getStudentById(studentId)
            setStudent(res.data.student)
        } catch {
            toast.error("Student not found")
        } finally {
            setStudentloading(false)
        }
    }

    const handleFetchBook = async () => {
        if (!bookQuery) {
            toast.error("Please enter book name or isbn no.")
            return
        }

        setBook(null)
        setBookLoading(true)

        try {
            const res = await getBooklookup({ q: bookQuery })
            setBook(res.data.book)
        } catch {
            toast.error("Book not found")
        } finally {
            setBookLoading(false)
        }
    }

    const handleIssuedBook = async (e) => {
        e.preventDefault()

        if (!student || !book || !remark || !dueDate) {
            toast.error("Please fill all fields")
            return
        }

        if (book.quantity <= 0) {
            toast.error("Book not available")
            return
        }

        setIssuing(true)

        try {
            await issueBook({
                student_id: student.student_id,
                book_id: book.id,
                remark,
                due_date: dueDate
            })

            toast.success("Book issued successfully")
            setRemark("")
            setDueDate("")
            setBook(null)
            setStudent(null)
            setStudentId("")
            setBookQuery("")
        } catch (error) {
            if (error.response?.data?.message) {
                toast.error(error.response.data.message)
            } else {
                toast.error("Failed to issue book")
            }
        } finally {
            setIssuing(false)
        }
    }

    

    return (
       
        <div className="py-10 bg-gray-100" style={{ background: "linear-gradient(135deg,#f3f4ff,#fdfbff)", minHeight: "100vh" }}>
            
            <div className="max-w-7xl mx-auto px-4">
                {/* d-flex justify-content-between align-items-center mb-4 */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        {/* h4 fw-bold mb-1 */}
                        <h4 className="text-xl font-bold mb-1">
                            <i className="fa-solid fa-book-open mr-2 text-blue-600"></i>
                            Issue a New Book
                        </h4>
                        {/* text-muted mb-0 */}
                        <p className="text-gray-500 mb-0">
                            Search student and book, then issue the book with a remark.
                        </p>
                    </div>

                   
                    <button
                        className="border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-4 py-2 rounded transition-colors"
                        onClick={() => navigate("/admin/issued-books")}
                    >
                        <i className="fa-solid fa-list mr-2"></i>
                        Manage Issued Books
                    </button>
                </div>

                {/* row g-4 */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                    {/* col-lg-7 */}
                    <div className="lg:col-span-7">
                        {/* card shadow-sm */}
                        <div className="bg-white rounded shadow-sm">
                            {/* card-body */}
                            <div className="p-4">
                                <form onSubmit={handleIssuedBook}>
                                    {/* mb-4 */}
                                    <div className="mb-6">
                                        {/* form-label fw-semibold */}
                                        <label className="block mb-1 font-semibold">
                                            Student ID <span className="text-red-500">*</span>
                                        </label>

                                        {/* input-group */}
                                        <div className="flex">
                                            <input
                                                type="text"
                                                // form-control
                                                className="flex-1 border border-gray-300 rounded-l px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                                                value={studentId}
                                                onChange={(e) => setStudentId(e.target.value)}
                                                onBlur={handleFetchStudent}
                                                placeholder="1001"
                                            />
                                            {/* btn btn-outline-secondary */}
                                            <button
                                                type="button"
                                                className="border border-l-0 border-gray-300 text-gray-600 hover:bg-gray-100 px-3 py-2 rounded-r transition-colors"
                                                onClick={handleFetchStudent}
                                            >
                                                {studentloading ? (
                                                    // spinner-border spinner-border-sm
                                                    <span className="inline-block w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></span>
                                                ) : (
                                                    <>
                                                        <i className="fa fa-search mr-1"></i> Find
                                                    </>
                                                )}
                                            </button>
                                        </div>

                                        {student && (
                                            // text-success mt-2 small fw-semibold
                                            <div className="text-green-600 mt-2 text-sm font-semibold">
                                                {student.full_name} ({student.student_id})
                                            </div>
                                        )}
                                    </div>

                                    {/* mb-4 */}
                                    <div className="mb-6">
                                        {/* form-label fw-semibold */}
                                        <label className="block mb-1 font-semibold">
                                            ISBN Number or Book Title <span className="text-red-500">*</span>
                                        </label>

                                        {/* input-group */}
                                        <div className="flex">
                                            <input
                                                type="text"
                                                // form-control
                                                className="flex-1 border border-gray-300 rounded-l px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                                                value={bookQuery}
                                                onChange={(e) => setBookQuery(e.target.value)}
                                                onBlur={handleFetchBook}
                                                placeholder="Enter ISBN or title"
                                            />
                                            {/* btn btn-outline-secondary */}
                                            <button
                                                type="button"
                                                className="border border-l-0 border-gray-300 text-gray-600 hover:bg-gray-100 px-3 py-2 rounded-r transition-colors"
                                                onClick={handleFetchBook}
                                            >
                                                {bookloading ? (
                                                    // spinner-border spinner-border-sm
                                                    <span className="inline-block w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></span>
                                                ) : (
                                                    <>
                                                        <i className="fa fa-book mr-1"></i> Find
                                                    </>
                                                )}
                                            </button>
                                        </div>

                                        {book && (
                                            // text-success mt-2 small fw-semibold
                                            <div className="text-green-600 mt-2 text-sm font-semibold">
                                                {book.title} (ISBN: {book.isbn}) - Qty: {book.quantity}
                                            </div>
                                        )}
                                    </div>

                                    {/* mb-4 */}
                                    <div className="mb-6">
                                        {/* form-label fw-semibold */}
                                        <label className="block mb-1 font-semibold">
                                            Remark <span className="text-red-500">*</span>
                                        </label>

                                        <textarea
                                            // form-control
                                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                                            rows="3"
                                            value={remark}
                                            onChange={(e) => setRemark(e.target.value)}
                                            placeholder="e.g. Issued for 7 days"
                                        ></textarea>
                                    </div>

                                    <label  className="block mb-1 font-semibold">
                                        Due Date <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                                        value={dueDate}
                                        onChange={(e) => setDueDate(e.target.value)}
                                    />
                                    <button
                                        type="submit"
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors disabled:opacity-60 gap-2 flex items-center mt-4"
                                        disabled={issuing}
                                    >
                                        {issuing ? (
                                            
                                            <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                        ) : (
                                            <>
                                                <i className="fa fa-arrow-right mr-2"></i>
                                                Issue Book
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>

                  
                    <div className="lg:col-span-5">
                        {student && (
                            
                            <div className="bg-white rounded shadow-sm mb-4">
                                <div className="p-4 flex items-center gap-3">
                 
                                    <div
                                        className="bg-gray-100 rounded-full flex items-center justify-center"
                                        style={{ width: "45px", height: "45px" }}
                                    >
                                        <i className="fa fa-user-graduate text-blue-600"></i>
                                    </div>

                                    <div>
                                        <div className="text-gray-500 text-sm">Student</div>
                                        <div className="font-semibold">{student.full_name}</div>
                                        <div className="text-gray-500 text-sm">
                                            {student.student_id} • {student.email}
                                        </div>
                                    </div>

                                    <div className='flex items-center gap-3 ml-auto'>
                                        {!student.is_active ? (
                                            <span className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">Inactive</span>
                                        ) : (
                                            <span className="bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded">Active</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {book && (
                            <div className="bg-white rounded shadow-sm">
                                {/* card-body d-flex align-items-center gap-3 */}
                                <div className="p-4 flex items-center gap-3">
                                    {book.cover_image && (
                                        <img
                                            src={book.cover_image}                                             
                                            
                                            alt="cover"
                                            className="rounded"
                                            style={{ width: "60px", height: "80px", objectFit: "cover" }}
                                        />
                                    )}

                                    <div>
                                     
                                        <div className="text-gray-500 text-sm">Book</div>
                                       
                                        <div className="font-semibold">{book.title}</div>
                                        <div className="text-gray-500 text-sm">
                                            ISBN: {book.isbn} • Qty: {book.quantity}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default IssuedBook