import React, { useState, useEffect } from 'react'
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"

import { getAuthors } from '../utils/authorApi'
import { getCategories } from '../utils/categoryApi'
import { deleteBook, getBooks, updateBook } from '../utils/bookApi'

const PAGE_SIZE = 8;



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
    const adminUser = localStorage.getItem("adminUser");
    const [loadingList, setLoadingList] = useState(false)
    const [saving, setSaving] = useState("")
    const navigate = useNavigate();
    const [search, setSearch] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    const filteredBooks = Array.isArray(books)
        ? books.filter((book) =>
            book.title.toLowerCase().includes(search.toLowerCase()) ||
            book.isbn.toLowerCase().includes(search.toLowerCase())
        )
        : []

    useEffect(() => {
        fetchAll(1);
    }, [])

    const fetchAll = async (page = 1) => {
        setLoadingList(true)
        try {
            const [authorsRes, categoriesRes, booksRes] = await Promise.all([
                getAuthors({ params: { limit: 100 } }),
                getCategories({ params: { limit: 100 } }),
                getBooks({ params: { page, limit: PAGE_SIZE } })
            ]);
            setAuthors(authorsRes.data?.results?.authors || []);
            setCategories(categoriesRes.data?.results?.categories || []);
            const bookList = booksRes.data?.results?.books || [];
            const totalCount = booksRes.data?.count || 0;

            setBooks(bookList);
            setTotalPages(Math.max(1, Math.ceil(totalCount / PAGE_SIZE)));
        }
        catch {
            toast.error("Failed to load data 😢 ")
        }
        finally {
            setLoadingList(false)
        }
    }

    const changePage = (page) => {
        if (page < 1 || page > totalPages) {
            return;
        }

        setCurrentPage(page);
        fetchAll(page);
    }

    const startEdit = (book) => {
        setEditId(book.id);
        setEditTitle(book.title);
        setEditCategory(book.category);
        setEditAuthor(book.author);
        setEditPrice(book.price);
        setEditQuantity(book.quantity);
        setEditImagePreview(book.cover_image);
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

            const res = await updateBook(editId, formData);

            if (res.data.success) {
                toast.success(res.data.message || "Book Updated 👍")
                cancelEdit();
                fetchAll(currentPage);
            }
            else {
                toast.error(res.data.message || "Updation Failed 😢")
            }
        }
        catch (err) {
            console.error(err);
            toast.error("Something Went Wrong 😢")
        }
        finally {
            setSaving(false)
        }
    }

    const handleDelete = async (id) => {
        const ok = window.confirm("Are you sure you want to delete this book?");
        if (!ok) return;
        try {
            const res = await deleteBook(id);
            if (res.data.success) {
                toast.success(res.data.message || "Book deleted 👍")
                const nextPage = books.length === 1 && currentPage > 1 ? currentPage - 1 : currentPage;
                setCurrentPage(nextPage);
                fetchAll(nextPage);
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
            toast.error("Something Went Wrong 😢")
        }
    }

    return (
        <>
            <div
                className="py-4 min-h-screen"
                style={{ background: "linear-gradient(135deg,#f3f4ff,#fdfbff)" }}
            >
                <div className="max-w-7xl mx-auto px-4">

                    {/* Page Heading */}
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h4 className="text-xl font-bold mb-1">
                                <i className="fa-solid fa-book text-blue-600 mr-2"></i>
                                Manage Books
                            </h4>
                            <p className="text-gray-500 text-sm mb-0">
                                View, edit and delete books from library.
                            </p>
                        </div>
                        <div>
                            <button
                                onClick={() => navigate("/admin/add-Book")}
                                className="inline-flex items-center gap-2 border border-blue-500 text-blue-600 text-sm px-3 py-1.5 rounded hover:bg-blue-50 transition-colors"
                            >
                                <i className="fa-solid fa-plus"></i>
                                Add New
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-4 items-start">

                        {/* Edit Book Form */}
                        <div className="w-full lg:w-1/3">
                            <div className="bg-white shadow-sm rounded-2xl">
                                <div className="p-6 flex flex-col">

                                    <h6 className="font-semibold text-sm mb-3">
                                        {editId ? "Edit Book" : "Select a book to edit."}
                                    </h6>

                                    {editId ? (
                                        <form onSubmit={handleUpdate} className="flex flex-col flex-grow">

                                            <div className="grid grid-cols-1 gap-3">

                                                <div>
                                                    <label className="block text-sm font-medium mb-1">
                                                        Book Name
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                                        placeholder="eg. The Great Gatsby, Harry Potter"
                                                        required
                                                        value={editTitle}
                                                        onChange={(e) => setEditTitle(e.target.value)}
                                                    />
                                                </div>

                                                <div className="grid grid-cols-2 gap-3">
                                                    <div>
                                                        <label className="block text-sm font-medium mb-1">
                                                            Category
                                                        </label>
                                                        <select
                                                            className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
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

                                                    <div>
                                                        <label className="block text-sm font-medium mb-1">
                                                            Author
                                                        </label>
                                                        <select
                                                            className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
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
                                                </div>

                                                <div className="grid grid-cols-2 gap-3">
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
                                                            value={editPrice}
                                                            onChange={(e) => setEditPrice(e.target.value)}
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
                                                            value={editQuantity}
                                                            onChange={(e) => setEditQuantity(e.target.value)}
                                                        />
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium mb-1">
                                                        Book Cover
                                                    </label>
                                                    {editImagePreview && (
                                                        <div className="mb-2">
                                                            <img
                                                                src={editImagePreview}
                                                                alt="Preview"
                                                                className="max-w-full rounded"
                                                                style={{ maxWidth: "100px", height: "100px", width: "100px" }}
                                                            />
                                                        </div>
                                                    )}
                                                    <input
                                                        type="file"
                                                        className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                                        accept="image/*"
                                                        onChange={handleImageChange}
                                                    />
                                                </div>

                                            </div>

                                            <div className="mt-auto flex flex-col gap-2 mt-4">
                                                <button
                                                    type="submit"
                                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm py-1.5 rounded transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-3"
                                                    disabled={saving}
                                                >
                                                    {saving ? (
                                                        <>
                                                            <span className="inline-block w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                                            Updating...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <i className="fa-solid fa-save"></i>
                                                            Update Book
                                                        </>
                                                    )}
                                                </button>

                                                <button
                                                    type="button"
                                                    className="w-full border border-gray-400 text-gray-600 text-sm py-1.5 rounded hover:bg-gray-50 transition-colors"
                                                    onClick={cancelEdit}
                                                >
                                                    Cancel
                                                </button>
                                            </div>

                                        </form>
                                    ) : (
                                        <p className="text-gray-500 text-sm">
                                            Click on the <strong>Edit</strong> button in the table to modify a author.
                                        </p>
                                    )}

                                </div>
                            </div>
                        </div>


                        <div className="w-full lg:flex-1">
                            <div className="bg-white shadow-sm rounded-2xl h-full">
                                <div className="p-6">

                                    <h6 className="font-semibold text-sm mb-3">
                                        Books Listing
                                    </h6>

                                    <div className="mb-3">
                                        <input
                                            type="text"
                                            className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400"
                                            placeholder="Search books by title or ISBN..."
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                        />
                                    </div>

                                    {loadingList ? (
                                        <div className="flex justify-center items-center py-10">
                                            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                        </div>
                                    ) : filteredBooks.length === 0 ? (
                                        <div className="flex items-center justify-center py-8">
                                            <p className="text-gray-500 text-sm">
                                                No books found. Try adding a new one.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-3 py-2">#</th>
                                                        <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-3 py-2">Cover Image</th>
                                                        <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-3 py-2">Book Name</th>
                                                        <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-3 py-2">Category</th>
                                                        <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-3 py-2">Author</th>
                                                        <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-3 py-2">ISBN No.</th>
                                                        <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-3 py-2">Quantity</th>
                                                        <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-3 py-2">Price</th>
                                                        <th className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wide px-3 py-2">Action</th>
                                                    </tr>
                                                </thead>

                                                <tbody>
                                                    {filteredBooks.map((book, index) => (
                                                        <tr key={book.id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">

                                                            <td className="px-3 py-2.5 text-gray-500">{(currentPage - 1) * PAGE_SIZE + index + 1}</td>

                                                            <td className="px-3 py-2.5" style={{ maxWidth: "1000px" }}>
                                                                <img
                                                                    src={book.cover_image}
                                                                    alt={book.title}
                                                                    className="rounded"
                                                                    style={{ maxWidth: "100px", height: "70px", marginBottom: "4px" }}
                                                                />
                                                            </td>

                                                            <td className="px-3 py-2.5">
                                                                <div className="font-bold text-sm text-gray-800">{book.title}</div>
                                                            </td>

                                                            <td className="px-3 py-2.5 font-medium text-gray-700">
                                                                {book.category_name}
                                                            </td>

                                                            <td className="px-3 py-2.5 font-medium text-gray-700">
                                                                {book.author_name}
                                                            </td>

                                                            <td className="px-3 py-2.5 font-medium text-gray-700">
                                                                {book.isbn}
                                                            </td>

                                                            <td className="px-3 py-2.5 font-medium text-gray-700">
                                                                {book.quantity}
                                                            </td>

                                                            <td className="px-3 py-2.5 font-medium text-gray-700">
                                                                {book.price}
                                                            </td>

                                                            <td className="px-3 py-2.5 text-center">
                                                                <div className="flex justify-center gap-2">
                                                                    <button
                                                                        onClick={() => startEdit(book)}
                                                                        className="border border-blue-500 text-blue-500 text-xs px-2.5 py-1 rounded hover:bg-blue-50 transition-colors"
                                                                    >
                                                                        <i className="fa-solid fa-pen-to-square mr-1" />Edit
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleDelete(book.id)}
                                                                        className="border border-red-500 text-red-500 text-xs px-2.5 py-1 rounded hover:bg-red-50 transition-colors"
                                                                    >
                                                                        <i className="fa-solid fa-trash-can mr-1" />Delete
                                                                    </button>
                                                                </div>
                                                            </td>

                                                        </tr>
                                                    ))}
                                                </tbody>

                                            </table>
                                        </div>
                                    )}

                                    <div className="mt-4 flex items-center justify-between gap-3 text-sm">
                                        <p className="text-gray-500">
                                            Page {currentPage} of {totalPages}
                                        </p>

                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() => changePage(currentPage - 1)}
                                                disabled={currentPage <= 1 || loadingList}
                                                className="px-3 py-1.5 rounded border border-gray-300 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                            >
                                                Prev
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => changePage(currentPage + 1)}
                                                disabled={currentPage >= totalPages || loadingList}
                                                className="px-3 py-1.5 rounded border border-gray-300 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                            >
                                                Next
                                            </button>
                                        </div>
                                    </div>

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