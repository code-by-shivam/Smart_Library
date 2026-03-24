import React, { useState, useEffect } from 'react'
import { toast } from "react-toastify"
import { useNavigate } from 'react-router-dom'
import { getCategories } from '../utils/categoryApi'
import { getAuthors } from '../utils/authorApi'
import { addBook } from '../utils/bookApi'

const DROPDOWN_PAGE_SIZE = 100;


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
    

    useEffect(() => {
        fetchDropdownData();
    }, [])

    const fetchDropdownData = async () => {
        setLoadingDropdowns(true);
        try {
            const [catRes, authRes] = await Promise.all([
                getCategories({ params: { limit: DROPDOWN_PAGE_SIZE } }),
                getAuthors({ params: { limit: DROPDOWN_PAGE_SIZE } })
            ]);

            const categoryList = catRes.data?.results?.categories || [];
            const authorList = authRes.data?.results?.authors || [];

            const activeCategories = Array.isArray(categoryList)
                ? categoryList.filter((cat) => cat.is_active)
                : [];

            setAuthors(Array.isArray(authorList) ? authorList : []);
            setCategories(activeCategories);
        }
        catch (error) {
            toast.error(error?.response?.data?.message || "Failed to load Authors/Categories 😢 ")
        }
        finally {
            setLoadingDropdowns(false);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)

        const formData = new FormData();
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
            const res = await addBook(formData);
            if (res.data.success) {
                toast.success(res.data.message || "Book Added Successfully 👌")
                setTitle("");
                setCategory("");
                setAuthor("");
                setIsbn("");
                setPrice("");
                setQuantity("");
                setCoverFile(null);
                fetchDropdownData();
            }
            else {
                toast.error(res.data.message || "Failed to create Book 😢")
            }
        }
        catch (err) {
            console.error(err);
            toast.error("Something Went Wrong 😢")
        }
        finally {
            setLoading(false)
        }
    }

    return (
        <>
            <div
                className="py-5 min-h-screen"
                style={{ background: "linear-gradient(135deg,#f3f4ff,#fdfbff)" }}
            >
                <div className="max-w-7xl mx-auto px-4">

                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h4 className="text-xl font-bold mb-1">
                                <i className="fa-solid fa-book text-blue-600 mr-2"></i>
                                Add Book
                            </h4>
                            <p className="text-gray-500 text-sm mb-0">
                                Create new book entries from this page.
                            </p>
                        </div>
                        <div>
                            <button
                                onClick={() => navigate("/admin/manage-book")}
                                className="inline-flex items-center gap-2 border border-blue-500 text-blue-600 text-sm px-3 py-1.5 rounded hover:bg-blue-50 transition-colors"
                            >
                                <i className="fa-solid fa-list"></i>
                                Manage Book
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-center">

                        {/* Add Book Form */}
                        <div className="w-full max-w-4xl">
                            <div className="bg-white shadow-sm rounded-2xl">
                                <div className="p-6">

                                    {loadingDropdowns ? (
                                        <div className="flex justify-center items-center" style={{ minHeight: "200px" }}>
                                            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleSubmit} className="flex flex-col flex-grow">

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                                <div>
                                                    <label className="block text-sm font-medium mb-1">
                                                        Book Name
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                                        placeholder="eg. The Great Gatsby, Harry Potter"
                                                        required
                                                        value={title}
                                                        onChange={(e) => setTitle(e.target.value)}
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium mb-1">
                                                        Category
                                                    </label>
                                                    <select
                                                        className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
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

                                                <div>
                                                    <label className="block text-sm font-medium mb-1">
                                                        Author
                                                    </label>
                                                    <select
                                                        className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
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

                                                <div>
                                                    <label className="block text-sm font-medium mb-1">
                                                        ISBN Number
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                                        placeholder="e.g. 978-3-16-148410-0"
                                                        required
                                                        value={isbn}
                                                        onChange={(e) => setIsbn(e.target.value)}
                                                    />
                                                    <p className="text-xs text-gray-400 mt-1">
                                                        Enter the ISBN number of the book.
                                                    </p>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium mb-1">
                                                        Price
                                                    </label>
                                                    <input
                                                        type="number"
                                                        className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                                        min="0"
                                                        step="0.01"
                                                        placeholder="e.g. 250.00"
                                                        required
                                                        value={price}
                                                        onChange={(e) => setPrice(e.target.value)}
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium mb-1">
                                                        Quantity
                                                    </label>
                                                    <input
                                                        type="number"
                                                        className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                                        min="1"
                                                        step="1"
                                                        placeholder="e.g. 10"
                                                        required
                                                        value={quantity}
                                                        onChange={(e) => setQuantity(e.target.value)}
                                                    />
                                                </div>

                                                <div className="md:col-span-2">
                                                    <label className="block text-sm font-medium mb-1">
                                                        Book Cover
                                                    </label>
                                                    <input
                                                        type="file"
                                                        className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                                        accept="image/*"
                                                        required
                                                        onChange={(e) => setCoverFile(e.target.files[0])}
                                                    />
                                                </div>

                                            </div>

                                            <div className="mt-6 flex justify-end">
                                                <button
                                                    type="submit"
                                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm py-1.5 rounded transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                                    disabled={loading}
                                                >
                                                    {loading ? (
                                                        <>
                                                            <span className="inline-block w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                                            Adding...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <i className="fa-solid fa-plus"></i>
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