import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"


function ManageBooks() {
    const [books, setBooks] = useState([])
    const [categories, setCategories] = useState([])
    const [authors, setAuthors] = useState([])

    const [editId, setEditId] = useState(null)
    const [editTitle, setEditTitle] = useState("")
    const [editCategory, setEditCategory] = useState("")
    const [editAuthor, setEditAuthor] = useState("")
    const [editQuantity, setEditQuantity] = useState("")
    const [editPrice, setEditPrice] = useState("")
    const [editImageFile, setEditImageFile] = useState(null)
    const [editImagePreview, setEditImagePreview] = useState(null)

    const [loadingList, setLoadingList] = useState(false)
    const [saving, setSaving] = useState("")
    const navigate = useNavigate();

    const adminUser = localStorage.getItem("adminUser");

    useEffect(() => {
        if (!adminUser) {
            navigate("/admin/login")
        }
        else {
            fetchAll();
        }
    }, [])

    const fetchAll = async () => {
        setLoadingList(true)
        try {
            const [authorsRes, categoriesRes, booksRes] = await Promise.all([
                axios.get("http://127.0.0.1:8000/api/admin/authors/"),
                axios.get("http://127.0.0.1:8000/api/categories/"),
                axios.get("http://127.0.0.1:8000/api/books/")
            ]);
            setAuthors(authorsRes.data);
            setCategories(categoriesRes.data);
            setBooks(booksRes.data);
        }
        catch (err) {
            toast.error("Failed to load data 😒 ")
        }
        finally {
            setLoadingList(false)
        }
    }

    const startEdit = (book) => {
        setEditId(book.id);
        setEditTitle(book.title);
        setEditCategory(book.category);
        setEditAuthor(book.author);
        setEditPrice(book.price);
        setEditQuantity(book.quantity);
        setEditImagePreview(`http://127.0.0.1:8000${book.cover_image}`);
        setEditImageFile(null);
    }

    const cancelEdit = () => {
        setEditId(null);
        setEditTitle("");
        setEditCategory("");
        setEditAuthor("");
        setEditPrice("");
        setEditQuantity("");
        setEditImagePreview(null);
        setEditImageFile(null);
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setEditImageFile(file);
            setEditImagePreview(URL.createObjectURL(file));
        }
    }

    const handleUpdate = async (e) => {
        e.preventDefault();
        setSaving(true)

        try {
            const formData = new FormData();
            formData.append("title", editTitle);
            formData.append("category", editCategory);
            formData.append("author", editAuthor);
            formData.append("price", editPrice);
            formData.append("quantity", editQuantity);
            if (editImageFile) {
                formData.append("cover_image", editImageFile);
            }

            const res = await axios.put(`http://127.0.0.1:8000/api/admin/update-book/${editId}/`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }

            });

            if (res.data.success) {
                toast.success(res.data.message || "Book Updated 👍")
                cancelEdit();
                fetchAll();
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

        const ok = window.confirm("Are you sure you want to delete this book?");
        if (!ok) return;
        try {
            const res = await axios.delete(`http://127.0.0.1:8000/api/admin/delete-book/${id}/`);
            if (res.data.success) {
                toast.success(res.data.message || "Book deleted 👍")
                setBooks((prev) => prev.filter((book) => book.id !== id))
                if (editId === id) {
                    cancelEdit();
                }
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
                className='py-4'
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
                                    <i className='fa-solid fa-book text-primary me-2'></i>
                                    Manage Books
                                </h4>
                                <p className='text-muted small mb-0'>
                                    View, edit and delete books from library.
                                </p>
                            </div>
                            <div style={{ width: '100px' }} className='text-end'>
                                <button
                                    onClick={() => navigate("/admin/add_book")}
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
                        <div className='col-lg-4'>
                            <div className='card border-0 shadow-sm rounded-4 h-60'>
                                <div className='card-body p-4 d-flex flex-column'>

                                    <h6 className='fw-semibold mb-3'>
                                        {editId ? "Edit Book" : "Select a book to edit."}
                                    </h6>

                                    {editId ? (
                                        <form onSubmit={handleUpdate} className='d-flex flex-column flex-grow-1'>

                                            <div className='row g-3'>
                                                <div className='col-md-12'>
                                                    <label className='form-label small fw-medium mb-1'>
                                                        Book Name
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className='form-control form-control-sm'
                                                        placeholder='eg. The Great Gatsby, Harry Potter'
                                                        required
                                                        value={editTitle}
                                                        onChange={(e) => setEditTitle(e.target.value)}
                                                    />
                                                </div>

                                                <div className='col-md-6'>
                                                    <label className='form-label small fw-medium mb-1'>
                                                        Category
                                                    </label>
                                                    <select
                                                        className='form-select  '
                                                        required
                                                        value={editCategory}
                                                        onChange={(e) => setEditCategory(e.target.value)}
                                                    >
                                                        <option value="">---Select Category---</option>
                                                        {categories.map((cat) => (
                                                            <option key={cat.id} value={cat.id}>
                                                                {cat.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>


                                                <div className='col-md-6'>
                                                    <label className='form-label small fw-medium mb-1'>
                                                        Author
                                                    </label>
                                                    <select
                                                        className='form-select  '
                                                        required
                                                        value={editAuthor}
                                                        onChange={(e) => setEditAuthor(e.target.value)}
                                                    >
                                                        <option value="">---Select Author---</option>
                                                        {authors.map((auth) => (
                                                            <option key={auth.id} value={auth.id}>
                                                                {auth.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>



                                                <div className='col-md-6'>
                                                    <label className='form-label small fw-medium mb-1'>
                                                        Price
                                                    </label>
                                                    <input
                                                        type="number"
                                                        className='form-control '
                                                        min="0"
                                                        step="0.01"
                                                        placeholder='e.g. 250.00'
                                                        required
                                                        value={editPrice}
                                                        onChange={(e) => setEditPrice(e.target.value)}
                                                    />
                                                </div>

                                                <div className='col-md-6'>
                                                    <label className='form-label small fw-medium mb-1'>
                                                        Quantity
                                                    </label>
                                                    <input
                                                        type="number"
                                                        className='form-control form-control-sm'
                                                        min="1"
                                                        step="1"
                                                        placeholder='e.g. 10'
                                                        required
                                                        value={editQuantity}
                                                        onChange={(e) => setEditQuantity(e.target.value)}
                                                    />
                                                </div>

                                                <div className='col-md-12'>
                                                    <label className='form-label small fw-medium mb-1'>
                                                        Book Cover
                                                    </label>
                                                    {editImagePreview && (
                                                        <div className='mb-2'>
                                                            <img src={editImagePreview} alt="Preview" className='img-fluid' style={{ maxWidth: "100px", height: "100px", width: "100px " }} />
                                                        </div>
                                                    )}

                                                    <input
                                                        type="file"
                                                        className='form-control '
                                                        accept='image/*'


                                                        onChange={handleImageChange}
                                                    />
                                                </div>
                                            </div>



                                            <div className='mt-auto d-flex flex-column gap-2'>
                                                <button
                                                    type='submit'
                                                    className='btn btn-primary w-100 btn-sm mt-3'
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
                                                            Update Book
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
                        <div className='col-lg-8'>
                            <div className='card border-0 shadow-sm rounded-4 h-100'>
                                <div className='card-body p-4'>

                                    <h6 className='fw-semibold mb-3'>
                                        Books Listing
                                    </h6>

                                    {loadingList ? (
                                        <div className='d-flex justify-content-center align-items-center py-5'>
                                            <div className='spinner-border text-primary' role='status'>
                                                <span className='visually-hidden'>Loading...</span>
                                            </div>
                                        </div>
                                    ) : books.length === 0 ? (
                                        <div className='d-flex align-items-center justify-content-center py-4'>
                                            <p className='text-muted small mb-0'>
                                                No books found. Try adding a new one.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className='table-responsive'>
                                            <table className='table table-striped table-hover align-middle small mb-0 align-middle'>
                                                <thead className='table-light'>
                                                    <tr>
                                                        <th >#</th>
                                                        <th>Cover Image</th>
                                                        <th>Book Name</th>

                                                        <th >Category</th>
                                                        <th >Author</th>
                                                        <th >ISBN No. </th>
                                                        <th>Qnantity</th>
                                                        <th>Price</th>
                                                        <th className='text-center'>Action</th>
                                                    </tr>
                                                </thead>

                                                <tbody>
                                                    {books.map((book, index) => (
                                                        <tr key={book.id}>

                                                            <td className='text-muted'>{index + 1}</td>
                                                            <td style={{ maxWidth: "200px" }} className='fw-medium'>
                                                                <img
                                                                    src={`http://127.0.0.1:8000${book.cover_image}`}
                                                                    alt={book.title}
                                                                    className="img-fluid rounded"
                                                                    style={{ maxWidth: "100px", height: "70px", marginBottom: "4px" }}
                                                                />

                                                            </td>
                                                            <td className='fw-medium'><div className='fw-bold small'>{book.title}</div></td>

                                                            <td className='fw-medium'>
                                                                {book.category_name}
                                                            </td>
                                                            <td className='fw-medium'>
                                                                {book.author_name}
                                                            </td>
                                                            <td className='fw-medium'>
                                                                {book.isbn}
                                                            </td>
                                                            <td className='fw-medium'>
                                                                {book.quantity}
                                                            </td>
                                                            <td className='fw-medium'>
                                                                {book.price}
                                                            </td>




                                                            <td className='text-center'>
                                                                <div className='d-flex justify-content-center gap-2'>
                                                                    <button
                                                                        onClick={() => startEdit(book)}
                                                                        className='btn btn-sm btn-outline-primary'
                                                                    >
                                                                        <i className='fa-solid fa-pen-to-square me-1' />Edit
                                                                    </button>
                                                                    <button onClick={() => handleDelete(book.id)} className='btn btn-sm btn-outline-danger'>
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

export default ManageBooks