import React, { useState, useEffect } from 'react'
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
import { getAuthors, updateAuthor, deleteAuthor } from '../utils/authorApi'

const PAGE_SIZE = 8;



function ManageAuthors() {
    const [editId, setEditId] = useState(null)
    const [editName, setEditName] = useState("")
    const [loadingList, setLoadingList] = useState(false)
    const [authors, setAuthors] = useState([])
    const [saving, setSaving] = useState("")
    const [search, setSearch] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const navigate = useNavigate();

    const filteredAuthors = Array.isArray(authors) ? authors : []

    useEffect(() => {
        fetchAuthors(1, "");
    }, [])

    const fetchAuthors = async (page = 1, searchTerm = search) => {
        setLoadingList(true)
        try {
            const res = await getAuthors({
                params: {
                    page,
                    limit: PAGE_SIZE,
                    ...(searchTerm.trim() ? { search: searchTerm.trim() } : {}),
                },
            });

            const authorList = res.data?.results?.authors || [];
            const totalCount = res.data?.count || 0;

            setAuthors(authorList);
            setTotalPages(Math.max(1, Math.ceil(totalCount / PAGE_SIZE)));
        }
        catch {
            toast.error("Failed to load Authors 😢 ")
        }
        finally {
            setLoadingList(false)
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
            const res = await updateAuthor(editId, { name: editName });
            if (res.data.success) {
                toast.success(res.data.message || "Author Updated 👍")
                cancelEdit();
                fetchAuthors(currentPage, search);
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
        const ok = window.confirm("Are you sure you want to delete this author?");
        if (!ok) return;
        try {
            const res = await deleteAuthor(id);
            if (res.data.success) {
                toast.success(res.data.message || "Author deleted 👍")
                const nextPage = authors.length === 1 && currentPage > 1 ? currentPage - 1 : currentPage;
                setCurrentPage(nextPage);
                fetchAuthors(nextPage, search);
            }
            else {
                toast.error(res.data.message || "Deletion Failed 😢")
            }
        }
        catch (err) {
            console.error(err);
            toast.error(err?.response?.data?.message || "Something Went Wrong 😢")
        }
    }

    return (
        <>
            <div
                className="py-5 min-h-screen"
                style={{ background: "linear-gradient(135deg,#f3f4ff,#fdfbff)" }}
            >
                <div className="max-w-7xl mx-auto px-4">

                    {/* Page Heading */}
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h4 className="text-xl font-bold mb-1">
                                <i className="fa-solid fa-user text-blue-600 mr-2"></i>
                                Manage Authors
                            </h4>
                            <p className="text-gray-500 text-sm mb-0">
                                View, edit and delete authors from library.
                            </p>
                        </div>
                        <div>
                            <button
                                onClick={() => navigate("/admin/add-author")}
                                className="inline-flex items-center gap-2 border border-blue-500 text-blue-600 text-sm px-3 py-1.5 rounded hover:bg-blue-50 transition-colors"
                            >
                                <i className="fa-solid fa-plus"></i>
                                Add New
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 items-start">

                        {/* Edit Author Form */}
                        <div className="w-full md:w-1/4">
                            <div className="bg-white shadow-sm rounded-2xl">
                                <div className="p-6 flex flex-col">

                                    <h6 className="font-semibold text-sm mb-3">
                                        {editId ? "Edit Author" : "Select an author to edit."}
                                    </h6>

                                    {editId ? (
                                        <form onSubmit={handleUpdate} className="flex flex-col flex-grow">

                                            <div className="mb-3">
                                                <label className="block text-sm font-semibold mb-1">
                                                    Author Name
                                                </label>
                                                <input
                                                    type="text"
                                                    className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                                    placeholder="Enter Author Name"
                                                    required
                                                    value={editName}
                                                    onChange={(e) => setEditName(e.target.value)}
                                                />
                                            </div>

                                            <div className="mt-auto flex flex-col gap-2">
                                                <button
                                                    type="submit"
                                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm py-1.5 rounded transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                                                            Update Author
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

                        
                        <div className="w-full md:flex-1">
                            <div className="bg-white shadow-sm rounded-2xl flex flex-col" style={{ minHeight: "580px" }}>
                                <div className="p-6 flex flex-col flex-grow">

                                    <h6 className="font-semibold text-sm mb-3">
                                        Authors Listing
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

                                    {loadingList ? (
                                        <div className="flex justify-center items-center py-10">
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
                                                        <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-3 py-2 w-24">Created</th>
                                                        <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-3 py-2 w-24">Updated</th>
                                                        <th className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wide px-3 py-2 w-40">Action</th>
                                                    </tr>
                                                </thead>

                                                <tbody>
                                                    {filteredAuthors.map((author, index) => (
                                                        <tr key={author.id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">

                                                                <td className="px-3 py-2.5 text-gray-500">{(currentPage - 1) * PAGE_SIZE + index + 1}</td>

                                                            <td className="px-3 py-2.5 font-medium text-gray-800">
                                                                {author.name}
                                                            </td>

                                                            <td className="px-3 py-2.5 text-gray-500">
                                                                {new Date(author.created_at).toLocaleDateString()}
                                                            </td>

                                                            <td className="px-3 py-2.5 text-gray-500">
                                                                {new Date(author.updated_at).toLocaleDateString()}
                                                            </td>

                                                            <td className="px-3 py-2.5 text-center">
                                                                <div className="flex justify-center gap-2">
                                                                    <button
                                                                        onClick={() => startEdit(author)}
                                                                        className="border border-blue-500 text-blue-500 text-xs px-2.5 py-1 rounded hover:bg-blue-50 transition-colors"
                                                                    >
                                                                        <i className="fa-solid fa-pen-to-square mr-1" />Edit
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleDelete(author.id)}
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

                                    <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between gap-3 text-sm">
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

export default ManageAuthors