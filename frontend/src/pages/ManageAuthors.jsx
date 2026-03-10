import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"


function ManageAuthors() {
    const [editId, setEditId] = useState(null)
    const [editName, setEditName] = useState("")
    const [loadingList, setLoadingList] = useState(false)
    const [authors, setAuthors] = useState([])
    const [saving, setSaving] = useState("")
    const navigate = useNavigate();

    const adminUser = localStorage.getItem("adminUser");

    useEffect(() => {
        if (!adminUser) {
            navigate("/admin/login")
        }
        else {
            fetchAuthors();
        }
    }, [])

    const fetchAuthors = async () => {
        setLoadingList(true)
        try {
            const res = await axios.get("http://127.0.0.1:8000/api/admin/authors/");
            setAuthors(res.data);
        }
        catch (err) {
            toast.error("Failed to load Authors 😒 ")
        }
        finally {
            setLoadingList(false)
        }
    }

    const startEdit = (author) => {
        setEditId(author.id);
        setEditName(author.name);
    }

    const cancelEdit = () => {
        setEditId(null);
        setEditName("");
    }

    const handleUpdate = async (e) => {
        e.preventDefault();
        setSaving(true)

        try {
            const res = await axios.put(`http://127.0.0.1:8000/api/admin/update-author/${editId}/`, { name: editName });
            if (res.data.success) {
                toast.success(res.data.message || "Author Updated 👍")
                cancelEdit();
                fetchAuthors();
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

        const ok = window.confirm("Are you sure you want to delete this author?");
        if (!ok) return;
        try {
            const res = await axios.delete(`http://127.0.0.1:8000/api/admin/delete-author/${id}/`);
            if (res.data.success) {
                toast.success(res.data.message || "Author deleted 👍")
                setAuthors((prev) => prev.filter((author) => author.id !== id))
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
                                    <i className='fa-solid fa-user text-primary me-2'></i>
                                    Manage Authors
                                </h4>
                                <p className='text-muted small mb-0'>
                                    View, edit and delete authors from library.
                                </p>
                            </div>
                            <div style={{ width: '100px' }} className='text-end'>
                                <button
                                    onClick={() => navigate("/admin/add_author")}
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
                                        {editId ? "Edit Author" : "Select an author to edit."}
                                    </h6>

                                    {editId ? (
                                        <form onSubmit={handleUpdate} className='d-flex flex-column flex-grow-1'>

                                            <div className='mb-3'>
                                                <label className='form-label small fw-semibold mb-1'>
                                                    Author Name
                                                </label>
                                                <input
                                                    type="text"
                                                    className='form-control form-control-sm'
                                                    placeholder='Enter Author Name'
                                                    required
                                                    value={editName}
                                                    onChange={(e) => setEditName(e.target.value)}
                                                />
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
                                                            <i className='fa-solid fa-save me-2'></i>
                                                            Update Author
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
                                            Click on the <strong>Edit</strong> button in the table to modify a author.
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
                                        Authors Listing
                                    </h6>

                                    {loadingList ? (
                                        <div className='d-flex justify-content-center align-items-center py-5'>
                                            <div className='spinner-border text-primary' role='status'>
                                                <span className='visually-hidden'>Loading...</span>
                                            </div>
                                        </div>
                                    ) : authors.length === 0 ? (
                                        <div className='d-flex align-items-center justify-content-center py-4'>
                                            <p className='text-muted small mb-0'>
                                                No author found. Try adding a new one.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className='table-responsive'>
                                            <table className='table table-striped table-hover align-middle small mb-0'>
                                                <thead className='table-light'>
                                                    <tr>
                                                        <th style={{ width: '48px' }}>#</th>
                                                        <th>Name</th>

                                                        <th style={{ width: '100px' }}>Created</th>
                                                        <th style={{ width: '100px' }}>Updated</th>
                                                        <th style={{ width: '160px' }} className='text-center'>Action</th>
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

                                                            <td className='text-muted'>
                                                                {new Date(author.updated_at).toLocaleDateString()}
                                                            </td>

                                                            <td className='text-center'>
                                                                <div className='d-flex justify-content-center gap-2'>
                                                                    <button
                                                                        onClick={() => startEdit(author)}
                                                                        className='btn btn-sm btn-outline-primary'
                                                                    >
                                                                        <i className='fa-solid fa-pen-to-square me-1' />Edit
                                                                    </button>
                                                                    <button onClick={() => handleDelete(author.id)} className='btn btn-sm btn-outline-danger'>
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

export default ManageAuthors