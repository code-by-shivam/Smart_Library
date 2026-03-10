import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"


function ManageCategories() {
    const [editId, setEditId] = useState(null)
    const [editName, setEditName] = useState("")
    const [editStatus, setEditStatus] = useState("1")
    const [loadingList, setLoadingList] = useState(false)
    const [categories, setCategories] = useState([])
    const [saving, setSaving] = useState("")
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
        setLoadingList(true)
        try {
            const res = await axios.get("http://127.0.0.1:8000/api/categories/");
            setCategories(res.data);
        }
        catch (err) {
            toast.error("Failed to load Categories 😒 ")
        }
        finally {
            setLoadingList(false)
        }
    }

    const startEdit = (cat) => {
        setEditId(cat.id);
        setEditName(cat.name);
        setEditStatus(cat.is_active ? "1" : "0");
    }

    const cancelEdit = () => {
        setEditId(null);
        setEditName("");
        setEditStatus("1");
    }

    const handleUpdate = async (e) => {
        e.preventDefault();
        setSaving(true)

        try {
            const res = await axios.put(`http://127.0.0.1:8000/api/admin/update-category/${editId}/`, { name: editName, status: editStatus });
            if (res.data.success) {
                toast.success(res.data.message || "Category Updated 👍")
                cancelEdit();
                fetchCategories();
            }
            else {
                toast.error(res.data.message || "Updation Failed 😢")
            }
        }
        catch (err) {
            console.error(err);
            toast.error("Something Went Wrong 😒")
        }
        finally {
            setSaving(false)
        }
    }

    const handleDelete = async (id) => {
        
const ok = window.confirm("Are you sure want to delete this category?");
if(!ok) return;
        try {
            const res = await axios.delete(`http://127.0.0.1:8000/api/admin/delete-category/${id}/`, { name: editName, status: editStatus });
            if (res.data.success) {
                toast.success(res.data.message || "Category deleted 👍")
                setCategories((prev)=>prev.filter((c)=>c.id !== id))
            }
            else {
                toast.error(res.data.message || "Deletion Failed 😢")
            }
        }
        catch (err) {
            console.error(err);
            toast.error("Something Went Wrong 😒")
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
                    <div className='row mb-4'>
                        <div className='col-12 d-flex justify-content-between align-items-center'>
                            <div style={{ width: '100px' }}></div>
                            <div className='text-center'>
                                <h4 className='fw-bold mb-1'>
                                    <i className='fa-solid fa-layer-group text-primary me-2'></i>
                                    Manage Category
                                </h4>
                                <p className='text-muted small mb-0'>
                                    View, edit and delete categories from library.
                                </p>
                            </div>
                            <div style={{ width: '100px' }} className='text-end'>
                                <button
                                    onClick={() => navigate("/admin/add_category")}
                                    className='btn btn-outline-primary btn-sm'
                                >
                                    <i className='fa-solid fa-plus me-1'></i>
                                    Add New
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className='row g-4'>

                        {/* Edit Category Form */}
                        <div className='col-md-4 col-lg-3'>
                            <div className='card border-0 shadow-sm rounded-4 h-60'>
                                <div className='card-body p-4 d-flex flex-column'>

                                    <h6 className='fw-semibold mb-3'>
                                        {editId ? "Edit Category" : "Select a category to edit."}
                                    </h6>

                                    {editId ? (
                                        <form onSubmit={handleUpdate} className='d-flex flex-column flex-grow-1'>

                                            <div className='mb-3'>
                                                <label className='form-label small fw-semibold mb-1'>
                                                    Category Name
                                                </label>
                                                <input
                                                    type="text"
                                                    className='form-control form-control-sm'
                                                    placeholder='Enter Category Name'
                                                    required
                                                    value={editName}
                                                    onChange={(e) => setEditName(e.target.value)}
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
                                                            checked={editStatus === "1"}
                                                            onChange={(e) => setEditStatus(e.target.value)}
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
                                                            checked={editStatus === "0"}
                                                            onChange={(e) => setEditStatus(e.target.value)}
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

                                            <div className='mt-auto d-flex flex-column gap-2'>
                                                <button
                                                    type='submit'
                                                    className='btn btn-primary w-100 btn-sm'
                                                    disabled={saving}
                                                >
                                                    {saving ? (
                                                        <>
                                                            <span className='spinner-border spinner-border-sm me-2' role='status' aria-hidden='true'></span>
                                                            Updating...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <i className='fa-solid fa-floppy-disk me-2'></i>
                                                            Update Category
                                                        </>
                                                    )}
                                                </button>

                                                <button
                                                    type='button'
                                                    className='btn btn-outline-secondary w-100 btn-sm'
                                                    onClick={cancelEdit}
                                                >
                                                    Cancel
                                                </button>
                                            </div>

                                        </form>
                                    ) : (
                                        <p className='text-muted small mb-0'>
                                            Click on the <strong>Edit</strong> button in the table to modify a category.
                                        </p>
                                    )}

                                </div>
                            </div>
                        </div>

                        {/* Category Table */}
                        <div className='col-md-8 col-lg-9'>
                            <div className='card border-0 shadow-sm rounded-4 h-100'>
                                <div className='card-body p-4'>

                                    <h6 className='fw-semibold mb-3'>
                                        Categories Listing
                                    </h6>

                                    {loadingList ? (
                                        <div className='d-flex justify-content-center align-items-center py-5'>
                                            <div className='spinner-border text-primary' role='status'>
                                                <span className='visually-hidden'>Loading...</span>
                                            </div>
                                        </div>
                                    ) : categories.length === 0 ? (
                                        <div className='d-flex align-items-center justify-content-center py-4'>
                                            <p className='text-muted small mb-0'>
                                                No category found. Try adding a new one.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className='table-responsive'>
                                            <table className='table table-striped table-hover align-middle small mb-0'>
                                                <thead className='table-light'>
                                                    <tr>
                                                        <th style={{ width: '48px' }}>#</th>
                                                        <th>Name</th>
                                                        <th style={{ width: '100px' }}>Status</th>
                                                        <th style={{ width: '100px' }}>Created</th>
                                                        <th style={{ width: '100px' }}>Updated</th>
                                                        <th style={{ width: '160px' }} className='text-center'>Action</th>
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

                                                            <td className='text-muted'>
                                                                {new Date(cat.updated_at).toLocaleDateString()}
                                                            </td>

                                                            <td className='text-center'>
                                                                <div className='d-flex justify-content-center gap-2'>
                                                                    <button
                                                                        onClick={() => startEdit(cat)}
                                                                        className='btn btn-sm btn-outline-primary'
                                                                    >
                                                                        <i className='fa-solid fa-pen-to-square me-1' />Edit
                                                                    </button>
                                                                    <button onClick={()=>handleDelete(cat.id)} className='btn btn-sm btn-outline-danger'>
                                                                        <i className='fa-solid fa-trash-can me-1' />Delete
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
                        </div>

                    </div>

                </div>
            </div>
        </>
    )
}

export default ManageCategories