import React, { useState, useEffect } from 'react'
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
import { getCategories, updateCategory, deleteCategory } from '../utils/categoryApi'

const PAGE_SIZE = 8;


function ManageCategory() {
    const [editId, setEditId] = useState(null)
    const [editName, setEditName] = useState("")
    const [editStatus, setEditStatus] = useState("1")
    const [loadingList, setLoadingList] = useState(false)
    const [categories, setCategories] = useState([])
    const [saving, setSaving] = useState("")
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchCategories(1, "");
    }, [])

    const fetchCategories = async (page = 1, searchTerm = search) => {
        setLoadingList(true)
        try {
            const res = await getCategories({
                params: {
                    page,
                    limit: PAGE_SIZE,
                    ...(searchTerm.trim() ? { search: searchTerm.trim() } : {}),
                },
            });

            const categoryList = res.data?.results?.categories || [];
            const totalCount = res.data?.count || 0;

            setCategories(categoryList);
            setTotalPages(Math.max(1, Math.ceil(totalCount / PAGE_SIZE)));
        } catch {
            toast.error("Failed to load Categories 😢")
        } finally {
            setLoadingList(false)
        }
    }

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearch(value);
        setCurrentPage(1);
        fetchCategories(1, value);
    }

    const changePage = (page) => {
        if (page < 1 || page > totalPages) {
            return;
        }

        setCurrentPage(page);
        fetchCategories(page, search);
    }

    const startEdit = (cat) => {
        setEditId(cat.id);
        setEditName(cat.name);
        setEditStatus(cat.is_active ? "1" : "0");
    }

    const cancelEdit = () => {
        setEditId(null);
        setEditName("");
        setEditStatus("1");
    }

    const handleUpdate = async (e) => {
        e.preventDefault();
        setSaving(true)
        try {
            const res = await updateCategory(editId, { name: editName, status: editStatus });
            if (res.data.success) {
                toast.success(res.data.message || "Category Updated 👍")
                cancelEdit();
                fetchCategories(currentPage, search);
            } else {
                toast.error(res.data.message || "Updation Failed 😢")
            }
        } catch (err) {
            console.error(err);
            toast.error("Something Went Wrong 😢")
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async (id) => {
        const ok = window.confirm("Are you sure want to delete this category?");
        if (!ok) return;
        try {
            const res = await deleteCategory(id);
            if (res.data.success) {
                toast.success(res.data.message || "Category deleted 👍")
                const nextPage = categories.length === 1 && currentPage > 1 ? currentPage - 1 : currentPage;
                setCurrentPage(nextPage);
                fetchCategories(nextPage, search);
            } else {
                toast.error(res.data.message || "Deletion Failed 😢")
            }
        } catch (err) {
            console.error(err);
            toast.error(err?.response?.data?.message || "Something Went Wrong 😢")
        }
    }

    return (
        <div
            className="py-5 min-h-screen"
            style={{ background: "linear-gradient(135deg,#f3f4ff,#fdfbff)" }}
        >
            <div className="max-w-7xl mx-auto px-4">

                <div className="flex justify-between items-center mb-8">

                    <div>
                        <h4 className="text-lg font-bold mb-1">
                            <i className="fa-solid fa-layer-group text-blue-500 mr-2"></i>
                            Manage Category
                        </h4>
                        <p className="text-gray-500 text-sm mb-0">
                            View, edit and delete categories from library.
                        </p>
                    </div>

                    <div>
                        <button
                            onClick={() => navigate("/admin/add-category")}
                            className="border border-blue-500 text-blue-500 text-sm px-3 py-1.5 rounded hover:bg-blue-50 transition-colors"
                        >
                            <i className="fa-solid fa-plus mr-1"></i>
                            Add New
                        </button>
                    </div>

                </div>

                <div className="flex flex-col md:flex-row gap-6 items-start">

                    {/* Edit Category Form */}
                    <div className="w-full md:w-1/4">
                        <div className="bg-white border-0 shadow-sm rounded-2xl">
                            <div className="p-5 flex flex-col">

                                <h6 className="font-semibold text-sm mb-3">
                                    {editId ? "Edit Category" : "Select a category to edit."}
                                </h6>

                                {editId ? (
                                    <form onSubmit={handleUpdate} className="flex flex-col flex-grow gap-0">

                                        <div className="mb-3">
                                            <label className="block text-xs font-semibold mb-1">
                                                Category Name
                                            </label>
                                            <input
                                                type="text"
                                                className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                                placeholder="Enter Category Name"
                                                required
                                                value={editName}
                                                onChange={(e) => setEditName(e.target.value)}
                                            />
                                        </div>

                                        <div className="mb-4">
                                            <label className="block text-xs font-semibold mb-1">
                                                Status
                                            </label>
                                            <div className="flex gap-4 mt-1">
                                                <label className="flex items-center gap-1.5 text-sm cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        value="1"
                                                        id="status-active"
                                                        name="status"
                                                        checked={editStatus === "1"}
                                                        onChange={(e) => setEditStatus(e.target.value)}
                                                        className="accent-blue-500"
                                                    />
                                                    Active
                                                </label>
                                                <label className="flex items-center gap-1.5 text-sm cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        value="0"
                                                        id="status-inactive"
                                                        name="status"
                                                        checked={editStatus === "0"}
                                                        onChange={(e) => setEditStatus(e.target.value)}
                                                        className="accent-blue-500"
                                                    />
                                                    Inactive
                                                </label>
                                            </div>
                                        </div>

                                        <div className="mt-auto flex flex-col gap-2">
                                            <button
                                                type="submit"
                                                className="w-full bg-blue-500 text-white text-sm py-1.5 rounded hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                                disabled={saving}
                                            >
                                                {saving ? (
                                                    <>
                                                        <span className="inline-block w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                                        Updating...
                                                    </>
                                                ) : (
                                                    <>
                                                        <i className="fa-solid fa-floppy-disk"></i>
                                                        Update Category
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
                                        Click on the <strong>Edit</strong> button in the table to modify a category.
                                    </p>
                                )}

                            </div>
                        </div>
                    </div>

                    {/* Category Table */}
                    <div className="w-full md:flex-1">
                        <div className="bg-white shadow-sm rounded-2xl flex flex-col" style={{ minHeight: "520px" }}>
                            <div className="p-5 flex flex-col flex-grow">

                                <h6 className="font-semibold text-sm mb-3">
                                    Categories Listing
                                </h6>

                                <div className="mb-3">
                                    <input
                                        type="text"
                                        className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400"
                                        placeholder="Search categories..."
                                        value={search}
                                        onChange={handleSearchChange}
                                    />
                                </div>

                                {loadingList ? (
                                    <div className="flex justify-center items-center py-10">
                                        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                ) : categories.length === 0 ? (
                                    <div className="flex items-center justify-center py-8">
                                        <p className="text-gray-500 text-sm">
                                            No category found. Try adding a new one.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead className="bg-gray-100">
                                                <tr>
                                                    <th className="px-3 py-2 text-left font-medium text-gray-600 w-12">#</th>
                                                    <th className="px-3 py-2 text-left font-medium text-gray-600">Name</th>
                                                    <th className="px-3 py-2 text-left font-medium text-gray-600 w-24">Status</th>
                                                    <th className="px-3 py-2 text-left font-medium text-gray-600 w-24">Created</th>
                                                    <th className="px-3 py-2 text-left font-medium text-gray-600 w-24">Updated</th>
                                                    <th className="px-3 py-2 text-center font-medium text-gray-600 w-40">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {categories.map((cat, index) => (
                                                    <tr key={cat.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">

                                                        <td className="px-3 py-2.5 text-gray-500">{(currentPage - 1) * PAGE_SIZE + index + 1}</td>

                                                        <td className="px-3 py-2.5 font-medium text-gray-800">{cat.name}</td>

                                                        <td className="px-3 py-2.5">
                                                            {cat.is_active ? (
                                                                <span className="inline-block px-2 py-0.5 text-xs rounded border border-green-400 bg-green-100 text-green-600">
                                                                    Active
                                                                </span>
                                                            ) : (
                                                                <span className="inline-block px-2 py-0.5 text-xs rounded border border-red-400 bg-red-100 text-red-600">
                                                                    Inactive
                                                                </span>
                                                            )}
                                                        </td>

                                                        <td className="px-3 py-2.5 text-gray-500">
                                                            {new Date(cat.created_at).toLocaleDateString()}
                                                        </td>

                                                        <td className="px-3 py-2.5 text-gray-500">
                                                            {new Date(cat.updated_at).toLocaleDateString()}
                                                        </td>

                                                        <td className="px-3 py-2.5 text-center">
                                                            <div className="flex justify-center gap-2">
                                                                <button
                                                                    onClick={() => startEdit(cat)}
                                                                    className="border border-blue-500 text-blue-500 text-xs px-2.5 py-1 rounded hover:bg-blue-50 transition-colors"
                                                                >
                                                                    <i className="fa-solid fa-pen-to-square mr-1" />Edit
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDelete(cat.id)}
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
    )
}

export default ManageCategory