import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { adminDashboardStats } from "../utils/studentApi";
import DashboardCard from "../components/DashboardCard";



function AdminDashboard() {

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const adminUser = localStorage.getItem("adminUser");
  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await adminDashboardStats();
      setStats(response.data?.stats );
    } catch (error) {
      console.error("Error fetching stats:", error);
      toast.error("Failed to load statistics");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="py-10"
      style={{
        background: "linear-gradient(135deg,#f5f7ff,#fdfbff)",
        minHeight: "100vh",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 relative">

        <div className="absolute top-0 right-0">
          <span className="bg-blue-100 text-blue-600 text-xs font-semibold px-3 py-2 rounded-full shadow-sm">
            <i className="fa-solid fa-shield-halved mr-1"></i>
            Admin Panel
          </span>
        </div>

        <div className="mb-8">
          <h2 className="font-bold flex items-center gap-2 text-2xl">
            <i className="fa-solid fa-gauge text-blue-600"></i>
            Admin Dashboard
          </h2>
          <p className="text-gray-500 mb-0">
            Quick overview of students, books and issued records.
          </p>
        </div>

        {loading && (
          <div className="text-center mt-10">
            <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {!loading && stats && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

              <div>
                <DashboardCard
                  icon="fa-solid fa-user-graduate"
                  iconBg="#eef2ff"
                  iconColor="#4f46e5"
                  title="TOTAL STUDENTS"
                  value={stats.total_students}
                  subtitle={
                    <>
                      <span className="text-green-600">Active: {stats.active_students}</span>{" "}
                      •{" "}
                      <span className="text-red-500">Blocked: {stats.blocked_students}</span>
                    </>
                  }
                />
              </div>

              <div>
                <DashboardCard
                  icon="fa-solid fa-book"
                  iconBg="#e6f9f0"
                  iconColor="#059669"
                  title="TOTAL BOOKS"
                  value={stats.total_books}
                  subtitle={
                    <>
                      <span className="text-green-600">Available: {stats.available_books}</span>{" "}
                      •{" "}
                      <span className="text-red-500 gap-2">Out of stock: {stats.out_of_stock_books}</span>
                    </>
                  }
                />
              </div>

              <div>
                <DashboardCard
                  icon="fa-solid fa-arrow-right-arrow-left"
                  iconBg="#fff4e6"
                  iconColor="#d97706"
                  title="ISSUED RECORDS"
                  value={stats.total_issued}
                  subtitle={
                    <>
                      <span className="text-blue-600">Issued: {stats.currently_issued}</span>{" "}
                      •{" "}
                      <span className="text-green-600">Returned: {stats.returned_books}</span>
                    </>
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">

              <div>
                <DashboardCard
                  icon="fa-solid fa-layer-group"
                  iconBg="#f3e8ff"
                  iconColor="#7c3aed"
                  title="CATEGORIES"
                  value={stats.total_categories}
                  subtitle={
                    <span className="text-gray-500">
                      Different genres / sections available
                    </span>
                  }
                />
              </div>

              <div>
                <DashboardCard
                  icon="fa-solid fa-feather"
                  iconBg="#ffe4e6"
                  iconColor="#e11d48"
                  title="AUTHORS"
                  value={stats.total_authors}
                  subtitle={
                    <span className="text-gray-500">
                      Authors whose books are available
                    </span>
                  }
                />
              </div>
            </div>

            <div className="text-gray-500 text-sm">
              Logged in as <strong>admin</strong>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;