import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"

function AddAuthor() {
    const [name, setName] = useState("")
    const [authors, setAuthors] = useState([])
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();

    const adminUser = localStorage.getItem("adminUser");

    useEffect(() => {
        if (!adminUser) {
            navigate("/admin/login")
        }
        else {
            fetchAuthors ();
        }
    }, [])

    const fetchAuthors = async () => {
        try {
            const res = await axios.get("http://127.0.0.1:8000/api/admin/authors/");
            setAuthors(res.data);
        }
        catch (err) {
            toast.error("Failed to load Authors 😒 ")
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)

        try {
            const res = await axios.post("http://127.0.0.1:8000/api/admin/add-author/", { name });
            if (res.data.success) {
                toast.success(res.data.message || "Author Created 👌")
                setName("")
                fetchAuthors();
            }
            else {
                toast.error(res.data.message || "Failed to create Author 😒")
            }
        }
        catch (err) {
            console.error(err);
            toast.error("Something Went Wrong 😒")
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
                                <i className='fa-solid fa-user-pen text-primary me-2'></i>
                                Add Author
                            </h4>
                            <p className='text-muted small mb-0'>
                                Create new book authors and manage their information from this page.
                            </p>
                        </div>
                    </div>

                    <div className='row g-4'>

                        {/* Add Author Form */}
                        <div className='col-md-4'>
                            <div className='card border-0 shadow-sm rounded-4 h-60'>
                                <div className='card-body p-4 d-flex flex-column'>

                                    <form onSubmit={handleSubmit} className='d-flex flex-column flex-grow-1'>

                                        <div className='mb-3'>
                                            <label className='form-label small fw-semibold mb-1'>
                                                Author Name
                                            </label>
                                            <input
                                                type="text"
                                                className='form-control form-control-sm'
                                                placeholder='Enter Author Name'
                                                required
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
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
                                                        Adding...
                                                    </>
                                                ) : (
                                                    <>
                                                        <i className='fa-solid fa-user-plus me-2'></i>
                                                        Add Author
                                                    </>
                                                )}
                                            </button>
                                        </div>

                                    </form>

                                </div>
                            </div>
                        </div>

                        {/* Category Table */}
                        <div className='col-md-8'>
                            <div className='card border-0 shadow-sm rounded-4 h-100'>
                                <div className='card-body p-4'>

                                    <h6 className='fw-semibold mb-3'>
                                        Existing Authors
                                    </h6>

                                    {authors.length === 0 ? (
                                        <div className='d-flex align-items-center justify-content-center py-4'>
                                            <p className='text-muted small mb-0'>
                                                No author found. Add your first author from the form.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className='table-responsive'>
                                            <table className='table table-hover align-middle small mb-0'>
                                                <thead className='table-light'>
                                                    <tr>
                                                        <th style={{ width: '48px' }}>#</th>
                                                        <th>Name</th>
                                                
                                                        <th style={{ width: '110px' }}>Created</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {authors.map((author, index) => (
                                                        <tr key={author.id}>

                                                            <td className='text-muted'>{index + 1}</td>

                                                            <td className='fw-medium'>
                                                                {author.name}
                                                            </td>

                                                    

                                                            <td className='text-muted'>
                                                                {new Date(author.created_at).toLocaleDateString()}
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

                </div>
            </div>
        </>
    )
}

export default AddAuthor