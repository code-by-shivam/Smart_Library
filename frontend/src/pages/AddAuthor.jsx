import React, { useState, useEffect } from 'react'
import { toast } from "react-toastify"
import { addAuthor, getAuthors } from '../utils/authorApi'
import { useNavigate } from 'react-router-dom';

const PAGE_SIZE = 8;


function AddAuthor() {
    const [name, setName] = useState("")
    const [authors, setAuthors] = useState([])
    const [loading, setLoading] = useState(false)
    const [search, setSearch] = useState("")
    const [loadingAuthors, setLoadingAuthors] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const navigate = useNavigate();

    const filteredAuthors = Array.isArray(authors) ? authors : []

    useEffect(() => {
        fetchAuthors(1, "");
    }, [])

    const fetchAuthors = async (page = 1, searchTerm = search) => {
        try {
            setLoadingAuthors(true);
            const res = await getAuthors({
                params: {
                    page,
                    limit: PAGE_SIZE,
                    ...(searchTerm.trim() ? { search: searchTerm.trim() } : {}),
                },
            });
            setAuthors(res.data?.results?.authors || []);
            const totalCount = res.data?.count || 0;
            setTotalPages(Math.max(1, Math.ceil(totalCount / PAGE_SIZE)));
        }
        catch {
            toast.error("Failed to load Authors 😢 ")
        }
        finally {
            setLoadingAuthors(false);
        }
    }

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearch(value);
        setCurrentPage(1);
        fetchAuthors(1, value);
    }

    const changePage = (page) => {
        if (page < 1 || page > totalPages) {
            return;
        }

        setCurrentPage(page);
        fetchAuthors(page, search);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)

        try {
            const res = await addAuthor({ name });
            if (res.data.success) {
                toast.success(res.data.message || "Author Created 🎉")
                setName("")
                setCurrentPage(1);
                fetchAuthors(1, search);
            }
            else {
                toast.error(res.data.message || "Failed to create Author 😢")
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
                                <i className="fa-solid fa-user-pen text-blue-600 mr-2"></i>
                                Add Author
                            </h4>
                            <p className="text-gray-500 text-sm mb-0">
                                Create new book authors and manage their information from this page.
                            </p>
                        </div>
                         <div>
                            <button
                                onClick={() => navigate("/admin/manage-author")}
                                className="inline-flex items-center gap-2 border border-blue-500 text-blue-600 text-sm px-3 py-1.5 rounded hover:bg-blue-50 transition-colors"
                            >
                                <i className="fa-solid fa-list"></i>
                                Manage Author
                            </button>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-12 gap-4">

                        <div className="md:col-span-4">
                            <div className="bg-white shadow-sm rounded-2xl">
                                <div className="p-6 flex flex-col">

                                    <form onSubmit={handleSubmit} className="flex flex-col flex-grow">

                                        <div className="mb-3">
                                            <label className="block text-sm font-semibold mb-1">
                                                Author Name
                                            </label>
                                            <input
                                                type="text"
                                                className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                                placeholder="Enter Author Name"
                                                required
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                            />
                                        </div>

                                        <div className="mt-auto">
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
                                                        <i className="fa-solid fa-user-plus"></i>
                                                        Add Author
                                                    </>
                                                )}
                                            </button>
                                        </div>

                                    </form>

                                </div>
                            </div>
                        </div>

                
                        <div className="md:col-span-8">
                            <div className="bg-white shadow-sm rounded-2xl flex flex-col" style={{ minHeight: "537px" }}>
                                <div className="p-6 flex flex-col flex-grow">

                                    <h6 className="font-semibold mb-3">
                                        Existing Authors
                                    </h6>

                                    <div className="mb-3">
                                        <input
                                            type="text"
                                            className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400"
                                            placeholder="Search authors..."
                                            value={search}
                                            onChange={handleSearchChange}
                                        />
                                    </div>

                                    {loadingAuthors ? (
                                        <div className="flex items-center justify-center py-8">
                                            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                        </div>
                                    ) : filteredAuthors.length === 0 ? (
                                        <div className="flex items-center justify-center py-8">
                                            <p className="text-gray-500 text-sm">
                                                No author found. Try another search or add a new author.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-3 py-2 w-12">#</th>
                                                        <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-3 py-2">Name</th>
                                                        <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-3 py-2 w-28">Created</th>
                                                        <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-3 py-2 w-28">Updated</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {filteredAuthors.map((author, index) => (
                                                        <tr key={author.id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">

                                                            <td className="px-3 py-2.5 text-gray-500">{index + 1}</td>

                                                            <td className="px-3 py-2.5 font-medium text-gray-800">
                                                                {author.name}
                                                            </td>

                                                            <td className="px-3 py-2.5 text-gray-500">
                                                                {new Date(author.created_at).toLocaleDateString()}
                                                            </td>
                                                            <td className="px-3 py-2.5 text-gray-500">
                                                                {new Date(author.updated_at).toLocaleDateString()}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}

                                    <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between gap-3 text-sm">
                                        <p className="text-gray-500">
                                            Page {currentPage} of {totalPages}
                                        </p>

                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() => changePage(currentPage - 1)}
                                                disabled={currentPage <= 1 || loadingAuthors}
                                                className="px-3 py-1.5 rounded border border-gray-300 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                            >
                                                Prev
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => changePage(currentPage + 1)}
                                                disabled={currentPage >= totalPages || loadingAuthors}
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

export default AddAuthor