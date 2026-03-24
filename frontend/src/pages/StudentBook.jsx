import React, { useEffect, useState } from 'react'
import { toast } from "react-toastify"
import { useNavigate } from 'react-router-dom'
import { getAuthors } from '../utils/authorApi'
import { getBooks } from '../utils/bookApi'
import { getCategories } from '../utils/categoryApi'

const PAGE_SIZE = 9

function StudentBooks() {
    const [books, setBooks] = useState([])
    const [categories, setCategories] = useState([])
    const [authors, setAuthors] = useState([])
    const [search, setSearch] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("")
    const [selectedAuthor, setSelectedAuthor] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    const booksList = Array.isArray(books) ? books : []

    useEffect(() => {
        const fetchLookups = async () => {
            try {
                const [authorsRes, categoriesRes] = await Promise.all([
                    getAuthors({ params: { limit: 100 } }),
                    getCategories({ params: { limit: 100 } }),
                ])

                setAuthors(authorsRes.data?.results?.authors || [])
                setCategories(categoriesRes.data?.results?.categories || [])
            } catch (err) {
                console.error(err)
                toast.error("Failed to load filters 😒")
            }
        }

        fetchLookups()
    }, [])

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                setLoading(true)

                const res = await getBooks({
                    params: {
                        page: currentPage,
                        limit: PAGE_SIZE,
                        search: search.trim(),
                        category: selectedCategory,
                        author: selectedAuthor,
                    },
                })

                const bookList = res.data?.results?.books || []
                const totalCount = res.data?.count || 0

                setBooks(bookList)
                setTotalPages(Math.max(1, Math.ceil(totalCount / PAGE_SIZE)))
            } catch (err) {
                console.error(err)
                toast.error("Failed to fetch books 😒")
                setBooks([])
                setTotalPages(1)
            } finally {
                setLoading(false)
            }
        }

        fetchBooks()
    }, [currentPage, search, selectedCategory, selectedAuthor])

    const changePage = (page) => {
        if (page < 1 || page > totalPages) {
            return
        }

        setCurrentPage(page)
    }

    const handleSearchChange = (e) => {
        setSearch(e.target.value)
        setCurrentPage(1)
    }

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value)
        setCurrentPage(1)
    }

    const handleAuthorChange = (e) => {
        setSelectedAuthor(e.target.value)
        setCurrentPage(1)
    }

    return (
        <div className='py-10' style={{ background: "linear-gradient(135deg,#f3f4ff,#fdfbff)", minHeight: "100vh" }}>
            <div className='max-w-7xl mx-auto px-4'>
                <div className='flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-6'>
                    <div>
                        <h3 className='mb-1 flex items-center gap-2 text-2xl font-semibold'>
                            <span
                                className='inline-flex items-center justify-center '
                                style={{ width: "40px", height: "40px", background: "#e0e7ff" }}
                            >
                                <i className='fa-solid fa-book text-blue-600' />
                            </span>
                            <span>Available Books</span>
                        </h3>
                        <p className='text-gray-500'>Browse our collection of available books</p>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-3 gap-3 w-full lg:w-auto'>
                        <div className='flex'>
                            <span className='inline-flex items-center px-3 border border-r-0 border-gray-300 rounded-l bg-white'>
                                <i className='fa-solid fa-search text-gray-500' />
                            </span>
                            <input
                                type='text'
                                className='w-full border border-gray-300 rounded-r px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300'
                                placeholder='Search by title, author, category, or ISBN'
                                value={search}
                                onChange={handleSearchChange}
                            />
                        </div>

                        <select
                            className='border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white'
                            value={selectedCategory}
                            onChange={handleCategoryChange}
                        >
                            <option value=''>All Categories</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>

                        <select
                            className='border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white'
                            value={selectedAuthor}
                            onChange={handleAuthorChange}
                        >
                            <option value=''>All Authors</option>
                            {authors.map((author) => (
                                <option key={author.id} value={author.id}>
                                    {author.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className='mb-4 flex flex-wrap items-center justify-between gap-3 text-sm text-gray-600'>
                    <div>
                        Showing page {currentPage} of {totalPages}
                    </div>
                    <div className='flex items-center gap-2'>
                        <button
                            type='button'
                            className='border border-gray-300 bg-white px-3 py-1.5 rounded disabled:opacity-50 disabled:cursor-not-allowed'
                            onClick={() => changePage(currentPage - 1)}
                            disabled={currentPage <= 1 || loading}
                        >
                            Previous
                        </button>
                        <button
                            type='button'
                            className='border border-gray-300 bg-white px-3 py-1.5 rounded disabled:opacity-50 disabled:cursor-not-allowed'
                            onClick={() => changePage(currentPage + 1)}
                            disabled={currentPage >= totalPages || loading}
                        >
                            Next
                        </button>
                    </div>
                </div>

                {loading && (
                    <div className='text-center my-10'>
                        <div className='inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin'></div>
                        <p className='mt-3 text-gray-500'>Loading...</p>
                    </div>
                )}

                {!loading && booksList.length === 0 && (
                    <div className='text-center my-10'>
                        <i className='fa-solid fa-book-open-reader text-gray-400' style={{ fontSize: "3rem" }} />
                        <p className='text-gray-500 my-3'>
                            No books found matching your filters.
                        </p>
                    </div>
                )}

                {!loading && booksList.length > 0 && (
                    <div className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-6'>
                        {booksList.map((book) => (
                            <div key={book.id}>
                                <div className='bg-white border-0 shadow-sm h-full rounded-2xl'>
                                    <div className='bg-gray-100 flex items-center justify-center' style={{ height: "200px" }}>
                                        <img
                                            src={book.cover_image}
                                            alt={book.title}
                                            className='max-w-full'
                                            style={{ maxHeight: "180px", objectFit: "contain" }}
                                        />
                                    </div>

                                    <div className='p-4'>
                                        <h6 className='font-semibold mb-1'>{book.title}</h6>

                                        <p className='text-gray-500 text-sm mb-2'>
                                            <i className='fa-solid fa-user-pen mr-2' />
                                            {book.author_name}
                                        </p>

                                        <span className='text-blue-600 border border-blue-200 text-xs font-semibold px-2 py-1 rounded'>
                                            {book.category_name}
                                        </span>

                                        <p className='text-gray-500 text-sm mt-2'>
                                            <i className='fa-solid fa-barcode mr-2' />
                                            {book.isbn}
                                        </p>

                                        <div className='flex justify-between items-center mt-3'>
                                            <span className='font-semibold text-green-600'>
                                                ₹{book.price}
                                            </span>

                                            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${book.available_quantity > 0
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-red-100 text-red-700'
                                                }`}>
                                                {book.available_quantity > 0
                                                    ? `Available (${book.available_quantity})`
                                                    : 'Unavailable'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default StudentBooks
