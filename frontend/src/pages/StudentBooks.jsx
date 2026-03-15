import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"

function StudentBooks() {

    const [books, setBooks] = useState([]);
    const [filter, setFilter] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    const studentUser = JSON.parse(localStorage.getItem("studentUser"));

    useEffect(() => {

        if (!studentUser) {
            toast.error("Please login to access the dashboard 😒");
            navigate("/user/login");
            return;
        }

        const fetchBooks = async () => {
            try {

                setLoading(true);

                const res = await axios.get(
                    "http://127.0.0.1:8000/api/user/books/"
                );

                setBooks(res.data);
                setFilter(res.data);

            } catch (err) {

                console.error(err);
                toast.error("Failed to fetch books 😒");

            } finally {
                setLoading(false);
            }
        };

        fetchBooks();

    }, []);



    useEffect(() => {

        const term = search.trim().toLowerCase();

        if (term === "") {
            setFilter(books);
            return;
        }

        const filteredBooks = books.filter(book =>
            book.title.toLowerCase().includes(term) ||
            book.author_name.toLowerCase().includes(term) ||
            book.category_name.toLowerCase().includes(term) ||
            book.isbn.toLowerCase().includes(term)
        );

        setFilter(filteredBooks);

    }, [search, books]);



    return (
        <div className='py-5' style={{ background: "linear-gradient(135deg,#f3f4ff,#fdfbff)", minHeight: "100vh" }}>

            <div className='container'>

                {/* Header */}
                <div className='d-flex flex-wrap justify-content-between align-items-center'>

                    <div>
                        <h3 className='mb-1 d-flex align-items-center gap-2'>
                            <span
                                className='d-inline-flex align-items-center justify-content-center rounded-3 border border-2'
                                style={{ width: "40px", height: "40px", background: "#e0e7ff" }}
                            >
                                <i className='fa-solid fa-book text-primary' />
                            </span>

                            <span>Available Books</span>
                        </h3>

                        <p className='text-muted'>
                            Browse our collection of available books
                        </p>
                    </div>


                    {/* Search */}
                    <div className='mt-3 py-2 px-4 d-inline-block'>
                        <div className='input-group'>
                            <span className='input-group-text'>
                                <i className='fa-solid fa-search' />
                            </span>

                            <input
                                type='text'
                                className='form-control'
                                placeholder='Search by title, author, category, or ISBN'
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                style={{ width: "250px" }}
                            />
                        </div>
                    </div>

                </div>


                {/* Loading */}
                {loading && (
                    <div className='text-center my-5'>
                        <div className="spinner-border text-primary"></div>
                        <p className='mt-3 text-muted'>Loading...</p>
                    </div>
                )}


                {/* Empty */}
                {!loading && filter.length === 0 && (
                    <div className='text-center my-5'>
                        <i className='fa-solid fa-book-open-reader text-muted' style={{ fontSize: "3rem" }} />
                        <p className='text-muted my-3'>
                            No books found matching your search criteria.
                        </p>
                    </div>
                )} 


                {/* Books */}
                {!loading && filter.length > 0 && (

                    <div className='row g-4 mb-4'>

                        {filter.map(book => (

                            <div className='col-md-4' key={book.id}>

                                <div className='card border-0 shadow-sm h-100 rounded-4'>

                                    <div className='bg-light d-flex align-items-center justify-content-center'
                                        style={{ height: "200px" }}>

                                        <img
                                            src={`http://localhost:8000${book.cover_image}`}
                                            alt={book.title}
                                            className='img-fluid'
                                            style={{ maxHeight: "180px", objectFit: "contain" }}
                                        />

                                    </div>

                                    <div className='card-body'>

                                        <h6 className='card-title'>{book.title}</h6>

                                        <p className='text-muted small mb-2'>
                                            <i className='fa-solid fa-user-pen me-2' />
                                            {book.author_name}
                                        </p>

                                        <span className='badge text-primary border border-primary-subtle'>
                                            {book.category_name}
                                        </span>

                                        <p className='text-muted small mt-2'>
                                            <i className='fa-solid fa-barcode me-2' />
                                            {book.isbn}
                                        </p>

                                        <div className='d-flex justify-content-between align-items-center mt-3'>

                                            <span className='fw-semibold text-success'>
                                                ₹{book.price}
                                            </span>

                                            <span className={`badge px-3 py-2 rounded-pill ${
                                                book.available_quantity > 0
                                                ? 'bg-success-subtle text-success'
                                                : 'bg-danger-subtle text-danger'
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
    );
}

export default StudentBooks;