import React, { useState, useEffect } from 'react'
import { toast } from "react-toastify"
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

import { getCategories, addCategory } from '../utils/categoryApi'

const PAGE_SIZE = 8;

function AddCategory() {
  const [name, setName] = useState("")
  const [status, setStatus] = useState("1")
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState([])
  const navigate = useNavigate();
  const [search, setSearch] = useState("")
  const [loadingCategories, setLoadingCategories] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchCategories(1, "");
  }, [])

  const fetchCategories = async (page = 1, searchTerm = search) => {
    try {
      setLoadingCategories(true);
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
    }
    catch {
      toast.error("Failed to load Categories 😢 ")
    }
    finally {
      setLoadingCategories(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)

    try {
      const res = await addCategory({ name, status });
      if (res.data.success) {
        toast.success(res.data.message || "Category Created 👌")
        setName("")
        setStatus("1")
        setCurrentPage(1);
        fetchCategories(1, search);
      }
      else {
        toast.error(res.data.message || "Failed to create Category 😢")
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

          {/* Header Row */}
          <div className="flex items-center justify-between mb-6">

            <div>
              <h4 className="text-xl font-bold mb-1">
                <i className="fa-solid fa-layer-group text-blue-600 mr-2"></i>
                Add Category
              </h4>
              <p className="text-gray-500 text-sm mb-0">
                Create new book categories and manage their active status
              </p>
            </div>

            <div>
              <Link
                to="/admin/manage-category"
                className="inline-flex items-center gap-2 border border-blue-500 text-blue-600 text-sm px-3 py-1.5 rounded hover:bg-blue-50 transition-colors"
              >
                <i className="fa-solid fa-list"></i>
                Manage Categories
              </Link>
            </div>

          </div>

          {/* Content Grid */}
          <div className="grid md:grid-cols-12 gap-4">


            <div className="md:col-span-4">
              <div className="bg-white shadow-sm rounded-2xl">
                <div className="p-6 flex flex-col">

                  <form onSubmit={handleSubmit} className="flex flex-col flex-grow">

                    <div className="mb-3">
                      <label className="block text-sm font-semibold mb-1">
                        Category Name
                      </label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Enter Category Name"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-semibold mb-1">
                        Status
                      </label>
                      <div className="flex gap-6 mt-1">
                        <div className="flex items-center gap-1.5">
                          <input
                            type="radio"
                            className="accent-blue-600 w-4 h-4"
                            value="1"
                            name="status"
                            id="status-active"
                            checked={status === "1"}
                            onChange={(e) => setStatus(e.target.value)}
                          />
                          <label htmlFor="status-active" className="text-sm">Active</label>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <input
                            type="radio"
                            className="accent-blue-600 w-4 h-4"
                            value="0"
                            id="status-inactive"
                            name="status"
                            checked={status === "0"}
                            onChange={(e) => setStatus(e.target.value)}
                          />
                          <label htmlFor="status-inactive" className="text-sm">Inactive</label>
                        </div>
                      </div>
                    </div>

                    <div className="mt-auto">
                      <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm py-1.5 rounded transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                        disabled={loading}
                      >
                        {loading ? "Creating..." : "Create Category"}
                      </button>
                    </div>

                  </form>

                </div>
              </div>
            </div>

            {/* Table Card */}
            <div className="md:col-span-8">
              <div className="bg-white shadow-sm rounded-2xl flex flex-col" style={{ minHeight: "520px" }}>

                <div className="p-6 flex flex-col flex-grow">

                  <h6 className="font-semibold mb-3">
                    Existing Categories
                  </h6>

                  <div className="mb-2">
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                      placeholder="Search category..."
                      value={search}
                      onChange={handleSearchChange}
                    />
                  </div>

                  {loadingCategories ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : categories.length === 0 ? (
                    <div className="flex items-center justify-center py-8">
                      <p className="text-gray-500 text-sm">
                        No category found.
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-3 py-2">#</th>
                            <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-3 py-2">Name</th>
                            <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-3 py-2">Status</th>
                            <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-3 py-2">Created</th>
                            <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-3 py-2">Updated</th>
                          </tr>
                        </thead>

                        <tbody>
                          {categories.map((cat, index) => (
                            <tr key={cat.id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors align-middle">
                              <td className="px-3 py-2 text-gray-600">{(currentPage - 1) * PAGE_SIZE + index + 1}</td>
                              <td className="px-3 py-2 text-gray-800">{cat.name}</td>

                              <td className="px-3 py-2">
                                {cat.is_active ? (
                                  <span className="inline-block bg-green-50 text-green-700 border border-green-500 text-xs font-medium px-2 py-0.5 rounded">
                                    Active
                                  </span>
                                ) : (
                                  <span className="inline-block bg-red-100 text-red-700 border border-red-500 text-xs font-medium px-2 py-0.5 rounded">
                                    Inactive
                                  </span>
                                )}
                              </td>

                              <td className="px-3 py-2 text-gray-500">
                                {new Date(cat.created_at).toLocaleDateString()}
                              </td>
                              {cat.updated_at ? (
                                <td className="px-3 py-2 text-gray-500">
                                  {new Date(cat.updated_at).toLocaleDateString()}
                                </td>
                              ) : (
                                <td className="px-3 py-2 text-gray-500">
                                  -
                                </td>
                              )}
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
                        disabled={currentPage <= 1 || loadingCategories}
                        className="px-3 py-1.5 rounded border border-gray-300 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        Prev
                      </button>

                      <button
                        type="button"
                        onClick={() => changePage(currentPage + 1)}
                        disabled={currentPage >= totalPages || loadingCategories}
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

export default AddCategory