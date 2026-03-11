import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"

function AddBook() {
    const [title, setTitle] = useState("")
    const [category, setCategory] = useState("")
    const [author, setAuthor] = useState("")
    const [isbn, setIsbn] = useState("")
    const [price, setPrice] = useState("")
    const [quantity, setQuantity] = useState("")
    const [authors, setAuthors] = useState([])
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(false)
    const [loadingDropdowns, setLoadingDropdowns] = useState(false)
    const [coverFile, setCoverFile] = useState(null)
    const navigate = useNavigate();

    const adminUser = localStorage.getItem("adminUser");

    useEffect(() => {
        if (!adminUser) {
            navigate("/admin/login")
        }
        else {
            fetchDropdownData();
        }
    }, [])

    const fetchDropdownData = async () => {
        setLoadingDropdowns(true);
        try {
            const [catRes, authRes] = await Promise.all([
                axios.get("http://127.0.0.1:8000/api/categories/"),
                axios.get("http://127.0.0.1:8000/api/admin/authors/")
            ]);
            const activeCategories = (catRes.data).filter((cat) => cat.is_active);
            setAuthors(authRes.data);
            setCategories(activeCategories);
        }
        catch (err) {
            toast.error("Failed to load Authors 😒 ")
        }
        finally {
            setLoadingDropdowns(false);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)

        const formData = new FormData(); // This is used to send multipart/form-data which can include files(images file in this case)
        formData.append("title", title);
        formData.append("category_id", category);
        formData.append("author_id", author);
        formData.append("isbn", isbn);
        formData.append("price", price);
        formData.append("quantity", quantity); 
        if (coverFile) {
            formData.append("cover_image", coverFile);
        }
        setLoading(true);
        try {
            const res = await axios.post("http://127.0.0.1:8000/api/admin/add-book/", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            if (res.data.success) {
                toast.success(res.data.message || "Book Added Successfully 👌")
                setTitle("");
                setCategory("");
                setAuthor("");
                setIsbn("");
                setPrice("");
                setQuantity("");
                setCoverFile(null);
                fetchDropdownData(); // To refresh the dropdowns in case a new category or author was added
            }
            else {
                toast.error(res.data.message || "Failed to create Book 😒")
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
                                <i className='fa-solid fa-book text-primary me-2'></i>
                                Add Book
                            </h4>
                            <p className='text-muted small mb-0'>
                                Create new book entries from this page.
                            </p>
                        </div>
                    </div>

                    <div className='row justify-content-center'>

                        {/* Add Book Form */}
                        <div className='col-md-10'>
                            <div className='card border-0 shadow-sm rounded-4'>
                                <div className='card-body p-4 '>
                                    {loadingDropdowns ? (
                                        <div className='d-flex justify-content-center align-items-center' style={{ minHeight: "200px" }}>
                                            <div className='spinner-border text-primary' role='status'>
                                                <span className='visually-hidden'>Loading...</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleSubmit} className='d-flex flex-column flex-grow-1'>

                                        <div className='row g-3'>
                                        <div className='col-md-6'>
                                            <label className='form-label small fw-medium mb-1'>
                                                Book Name
                                            </label>
                                            <input
                                                type="text"
                                                className='form-control form-control-sm'
                                                placeholder='eg. The Great Gatsby, Harry Potter'
                                                required
                                                value={title}
                                                onChange={(e) => setTitle(e.target.value)}
                                            />
                                        </div>

                                        <div className='col-md-6'>
                                            <label className='form-label small fw-medium mb-1'>
                                                Category
                                            </label>
                                            <select
                                                className='form-select  '
                                                required
                                                value={category}
                                                onChange={(e) => setCategory(e.target.value)}
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
                                                value={author}
                                                onChange={(e) => setAuthor(e.target.value)}
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
                                                ISBN Number
                                            </label>
                                            <input
                                                type="text"
                                                className='form-control'
                                                placeholder='e.g. 978-3-16-148410-0'
                                                required
                                                value={isbn}
                                                onChange={(e) => setIsbn(e.target.value)}
                                            />
                                            <p className='form-text small text-muted'>
                                                Enter the ISBN number of the book.
                                            </p>
                                        </div>

                                         <div className='col-md-4'>
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
                                                value={price}
                                                onChange={(e) => setPrice(e.target.value)}
                                            />
                                        </div>

                                         <div className='col-md-4'>
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
                                                value={quantity}
                                                onChange={(e) => setQuantity(e.target.value)}
                                            />
                                        </div>

                                         <div className='col-md-4'>
                                            <label className='form-label small fw-medium mb-1'>
                                                Book Cover
                                            </label>
                                            <input
                                                type="file"
                                                className='form-control '
                                                accept='image/*'
                                                required
                                        
                                                onChange={(e) => setCoverFile(e.target.files[0])}
                                            />
                                        </div>
                                        </div>


                                        <div className='mt-4 d-flex justify-content-end'>
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
                                                        <i className='fa-solid fa-plus me-2'></i>
                                                        Add Book
                                                    </>
                                                )}
                                            </button>
                                        </div>

                                    </form>
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

export default AddBook