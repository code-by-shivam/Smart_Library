
import React, { useState, useEffect, use } from 'react'
import axios from 'axios'
import { toast } from "react-toastify"
import { Link, useNavigate } from "react-router-dom"

function StudentBooks() {
    const [books, setBooks] = useState([]);
    const [filter, setFilter] = useState("all");
    const [search,setSearch]=useState("");
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
                const res = await axios.get("http://127.0.0.1:8000/api/user/books/",);
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


    useEffect(()=>{
        const term=search.trim().toLowerCase();
        if(term===""){
            setFilter(books);
            return;
        }
        const filteredBooks=books.filter(book=>{
            book.title.toLowerCase().includes(term) 
            || book.author.toLowerCase().includes(term) 
            || book.category.toLowerCase().includes(term)
            || book.isbn.toLowerCase().includes(term)
            
        });
        setFilter(filteredBooks);
    }, [search, books]);
    
    return (
        <>
        <div className='py-5' style={{ background: "linear-gradient(135deg,#f3f4ff,#fdfbff)", minHeight: "100vh" }}>
                        <div className='container'>
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
                                    <p className='text-muted'>Browse our collection of available books</p>
                                </div>
                                <div>
                                    <p className='mt-3  py-2 px-4 d-inline-block'>
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
                                                style={{width:"250px"}}
                                            />
                                        </div>
                                    </p>
                                </div>
                            </div>
        
                            {loading && (
                                <div className='text-center my-5'>
                                    <div className="spinner-border text-primary" role="status">
                                        <i className='fa-solid fa-spinner fa-spin' />
                                        <span className="mt-3 text-muted">Loading...</span>
                                    </div>
                                </div>
                            )}

                            {filter.length === 0 && !loading && (
                                <div className='text-center my-5'>
                                    <i className='fa-solid fa-book-open-reader text-muted' style={{ fontSize: "3rem" }} />
                                    <p className='text-muted my-3'>No books found matching your search criteria.</p>
                                </div>
                            )}

                            {!loading && filter.length > 0 && (
                                <div className='row g-4 mb-4'>
                                    {filter.map((book) => (
                                        <div className='col-md-4' key={book.id}>
                                            <div className='card border-0 shadow-sm h-100 rounded-4'>
                                                <div className='card-body d-flex flex-column'>
                                                    
                                                        <h6 className='card-title text-truncate mb-1'>{book.title}</h6>
                                                        <p className='text-muted small mb-2'> <i className='fa-solid fa-user-pen me-2' />{book.author_name}</p>
                                                        <p className='text-muted small mb-1'><span className='badge text-primary border border-primary-subtle'>
                                                            <i className='fa-solid fa-tag me-2' />
                                                            {book.category_name}
                                                            </span></p>
                                                            <p className='text-muted small mb-1'><i className='fa-solid fa-barcode me-2' />{book.isbn}</p>
                                                    <div className='d-flex justify-content-between align-items-center mt-2'>
                                                        <span className='fw-semibold text-success'>{book.price}</span>
                                                        <span className={`badge px-3 py-2 rounded-pill ${book.available_quantity > 0 ? 'bg-success-subtle text-success border border-success-subtle' : 'bg-danger-subtle text-danger border border-danger-subtle'}`}>
                                                            {book.available_quantity > 0 ? `Available (${book.available_quantity})` : 'Unavailable'}
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
        </>
  )
}

export default StudentBooks;