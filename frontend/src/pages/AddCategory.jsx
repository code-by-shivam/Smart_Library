import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"

function AddCategory() {
    const [name, setName] = useState("")
    const [status, setStatus] = useState("1")
    const [loading, setLoading] = useState(false)
    const [categories, setCategories] = useState([])
    const navigate = useNavigate();

    const adminUser = localStorage.getItem("adminUser");

    useEffect(() => {
        if (!adminUser) {
            navigate("/admin/login")
        }
        else {
            fetchCategories();
        }
    }, [])

    const fetchCategories = async () => {
        try {
            const res = await axios.get("http://127.0.0.1:8000/api/categories/");
            setCategories(res.data);
        }
        catch (err) {
            toast.error("Failed to load Categories 😒 ")
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)

        try {
            const res = await axios.post("http://127.0.0.1:8000/api/admin/add-Category/", { name, status });
            if (res.data.success) {
                toast.success(res.data.message || "Category Created 👌")
                setName("")
                setStatus("1")
                fetchCategories();
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
                                <i className='fa-solid fa-layer-group text-primary me-2'></i>
                                Add Category
                            </h4>
                            <p className='text-muted small mb-0'>
                                Create new book categories and manage their active status
                            </p>
                        </div>
                    </div>

                    <div className='row g-4'>

                        {/* Add Category Form */}
                        <div className='col-md-4'>
                            <div className='card border-0 shadow-sm rounded-4 h-60'>
                                <div className='card-body p-4 d-flex flex-column'>

                                    <form onSubmit={handleSubmit} className='d-flex flex-column flex-grow-1'>

                                        <div className='mb-3'>
                                            <label className='form-label small fw-semibold mb-1'>
                                                Category Name
                                            </label>
                                            <input
                                                type="text"
                                                className='form-control form-control-sm'
                                                placeholder='Enter Category Name'
                                                required
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                            />
                                        </div>

                                        <div className='mb-4'>
                                            <label className='form-label small fw-semibold mb-1'>
                                                Status
                                            </label>
                                            <div className='d-flex gap-3 mt-1'>
                                                <div className='form-check mb-0'>
                                                    <input
                                                        type="radio"
                                                        className='form-check-input'
                                                        value="1"
                                                        id='status-active'
                                                        name="status"
                                                        checked={status === "1"}
                                                        onChange={(e) => setStatus(e.target.value)}
                                                    />
                                                    <label
                                                        className="form-check-label small"
                                                        htmlFor="status-active"
                                                    >
                                                        Active
                                                    </label>
                                                </div>

                                                <div className='form-check mb-0'>
                                                    <input
                                                        type="radio"
                                                        className='form-check-input'
                                                        value="0"
                                                        id='status-inactive'
                                                        name="status"
                                                        checked={status === "0"}
                                                        onChange={(e) => setStatus(e.target.value)}
                                                    />
                                                    <label
                                                        className="form-check-label small"
                                                        htmlFor="status-inactive"
                                                    >
                                                        Inactive
                                                    </label>
                                                </div>
                                            </div>
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
                                                        Creating...
                                                    </>
                                                ) : (
                                                    <>
                                                        <i className='fa-solid fa-plus me-2'></i>
                                                        Create Category
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
                                        Existing Categories
                                    </h6>

                                    {categories.length === 0 ? (
                                        <div className='d-flex align-items-center justify-content-center py-4'>
                                            <p className='text-muted small mb-0'>
                                                No category found. Add your first category from the form.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className='table-responsive'>
                                            <table className='table table-hover align-middle small mb-0'>
                                                <thead className='table-light'>
                                                    <tr>
                                                        <th style={{ width: '48px' }}>#</th>
                                                        <th>Name</th>
                                                        <th style={{ width: '100px' }}>Status</th>
                                                        <th style={{ width: '110px' }}>Created</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {categories.map((cat, index) => (
                                                        <tr key={cat.id}>

                                                            <td className='text-muted'>{index + 1}</td>

                                                            <td className='fw-medium'>
                                                                {cat.name}
                                                            </td>

                                                            <td>
                                                                {cat.is_active ? (
                                                                    <span className='badge bg-success-subtle text-success border border-success px-2 py-1'>
                                                                        Active
                                                                    </span>
                                                                ) : (
                                                                    <span className='badge bg-secondary-subtle text-secondary border border-secondary px-2 py-1'>
                                                                        Inactive
                                                                    </span>
                                                                )}
                                                            </td>

                                                            <td className='text-muted'>
                                                                {new Date(cat.created_at).toLocaleDateString()}
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

export default AddCategory