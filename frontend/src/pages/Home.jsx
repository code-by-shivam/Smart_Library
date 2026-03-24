import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { homedata } from "../utils/studentApi";


function Home() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await homedata();
        setStats(res.data.stats);
      } catch {
        console.error("Failed to fetch stats");
      }
    };
    fetchStats();
  }, []);

  return (
    <div
      className="py-10"
      style={{
        background: "linear-gradient(135deg,#f5f7ff,#eef2ff)",
        minHeight: "100vh",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 flex flex-col gap-14">

        {/* HERO SECTION */}
        <div className="flex flex-wrap items-center gap-y-8">

          <div className="w-full md:w-1/2 pr-0 md:pr-6">

            <span className="inline-flex items-center bg-blue-100 text-blue-600 px-3 py-1.5 rounded-full text-sm font-medium mb-4">
              <i className="fa-solid fa-book mr-1"></i>
              Smart Library Management System
            </span>

            <h1 className="text-4xl font-bold mb-4">
              Manage your <span className="text-blue-600">Library</span> smarter,
              faster and from anywhere.
            </h1>

            <p className="text-gray-500 mb-6">
              Smart Library is a modern web-based system where the admin can
              manage books, students, issued books and fines in one place.
              Students can view their issued books, due dates and fines anytime.
            </p>

            <div className="flex flex-wrap gap-3 mb-5">
              <Link to="/admin/login" className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
                <i className="fa-solid fa-shield-halved mr-2"></i>
                Admin Login
              </Link>

              <Link to="/student/login" className="inline-flex items-center border border-blue-600 text-blue-600 px-4 py-2 rounded hover:bg-blue-50 transition-colors">
                <i className="fa-solid fa-user-graduate mr-2"></i>
                Student Login
              </Link>

              <Link to="/student/signup" className="text-blue-600 font-semibold self-center">
                <i className="fa-solid fa-user-plus mr-1"></i>
                New student? Register now
              </Link>
            </div>

            <div className="flex flex-wrap gap-4 text-gray-500 text-sm">
              <span><i className="fa-solid fa-circle-check text-green-500 mr-1"></i> Online book listing</span>
              <span><i className="fa-solid fa-circle-check text-green-500 mr-1"></i> Issued / returned history</span>
              <span><i className="fa-solid fa-circle-check text-green-500 mr-1"></i> Fine management</span>
            </div>

          </div>

          <div className="w-full md:w-1/2">
            <div className="bg-white shadow-sm rounded-2xl p-6">
              <h5 className="text-lg font-bold mb-4">⚡ Quick Overview</h5>

              <p className="text-gray-500 text-sm mb-4">
                This system is perfect for academic projects – converted from a PHP version
                into a modern Django + React implementation.
              </p>

              <ul className="list-none text-sm space-y-3">
                <li>
                  <i className="fa-solid fa-layer-group text-blue-600 mr-2"></i>
                  <strong>Admin Panel:</strong> Full control over categories, authors, books, students and issued books.
                </li>
                <li>
                  <i className="fa-solid fa-users text-green-600 mr-2"></i>
                  <strong>Student Area:</strong> Profile, password change, listed books and issued history.
                </li>
                <li>
                  <i className="fa-solid fa-cloud text-sky-500 mr-2"></i>
                  <strong>Web Based:</strong> Access from any browser – no extra software required.
                </li>
              </ul>

              <hr className="my-4" />

              <p className="text-sm text-gray-500 mb-0">
                <i className="fa-solid fa-circle-info mr-1"></i>
                Use the navigation bar above to switch between <b>Admin</b> and <b>Student</b> modules.
              </p>
            </div>
          </div>

        </div>

        {/* STATS SECTION */}
        {stats && (
          <div>
            <div className="mb-6">
              <h4 className="text-xl font-bold mb-1">
                <i className="fa-solid fa-chart-bar text-blue-600 mr-2"></i>
                Library at a Glance
              </h4>
              <p className="text-gray-400 text-sm">Live overview of library resources and activity</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">

              <div className="bg-white rounded-2xl shadow-sm p-5 flex flex-col items-center text-center border-t-4 border-blue-500">
                <div className="bg-blue-100 p-3 rounded-full mb-3">
                  <i className="fa-solid fa-user-graduate text-blue-600 text-xl"></i>
                </div>
                <p className="text-3xl font-bold text-blue-600">{stats.total_students}</p>
                <p className="text-gray-500 text-xs mt-1 font-medium">Total Students</p>
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-5 flex flex-col items-center text-center border-t-4 border-green-500">
                <div className="bg-green-100 p-3 rounded-full mb-3">
                  <i className="fa-solid fa-book text-green-600 text-xl"></i>
                </div>
                <p className="text-3xl font-bold text-green-600">{stats.total_books}</p>
                <p className="text-gray-500 text-xs mt-1 font-medium">Total Books</p>
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-5 flex flex-col items-center text-center border-t-4 border-emerald-500">
                <div className="bg-emerald-100 p-3 rounded-full mb-3">
                  <i className="fa-solid fa-book-open text-emerald-600 text-xl"></i>
                </div>
                <p className="text-3xl font-bold text-emerald-600">{stats.available_books}</p>
                <p className="text-gray-500 text-xs mt-1 font-medium">Available Books</p>
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-5 flex flex-col items-center text-center border-t-4 border-yellow-400">
                <div className="bg-yellow-100 p-3 rounded-full mb-3">
                  <i className="fa-solid fa-layer-group text-yellow-500 text-xl"></i>
                </div>
                <p className="text-3xl font-bold text-yellow-500">{stats.total_categories}</p>
                <p className="text-gray-500 text-xs mt-1 font-medium">Categories</p>
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-5 flex flex-col items-center text-center border-t-4 border-purple-500">
                <div className="bg-purple-100 p-3 rounded-full mb-3">
                  <i className="fa-solid fa-pen-nib text-purple-600 text-xl"></i>
                </div>
                <p className="text-3xl font-bold text-purple-600">{stats.total_authors}</p>
                <p className="text-gray-500 text-xs mt-1 font-medium">Authors</p>
              </div>

            </div>
          </div>
        )}

        {/* KEY FEATURES SECTION */}
        <div>
          <div className="mb-6">
            <h4 className="text-xl font-bold mb-1">Key Features</h4>
            <p className="text-gray-400 text-sm">Everything you need to manage a modern library</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

            <div className="bg-white shadow-sm rounded-2xl p-5">
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 p-3 rounded-xl">
                  <i className="fa-solid fa-book text-blue-600 text-lg"></i>
                </div>
                <div>
                  <h6 className="font-semibold mb-1">Simple Book Management</h6>
                  <p className="text-gray-500 text-sm mb-0">
                    Easily add, edit and delete books, categories and authors.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white shadow-sm rounded-2xl p-5">
              <div className="flex items-center gap-4">
                <div className="bg-green-100 p-3 rounded-xl">
                  <i className="fa-solid fa-user text-green-600 text-lg"></i>
                </div>
                <div>
                  <h6 className="font-semibold mb-1">Student-Friendly Portal</h6>
                  <p className="text-gray-500 text-sm mb-0">
                    Students can view issued books, due dates and history easily.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white shadow-sm rounded-2xl p-5">
              <div className="flex items-center gap-4">
                <div className="bg-yellow-100 p-3 rounded-xl">
                  <i className="fa-solid fa-chart-line text-yellow-500 text-lg"></i>
                </div>
                <div>
                  <h6 className="font-semibold mb-1">Ideal for Academic Projects</h6>
                  <p className="text-gray-500 text-sm mb-0">
                    Covers all modules required for a full-stack project.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default Home;