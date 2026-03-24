import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { adminLogin } from "../utils/authApi";

const AdminLogin = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        username: "superuser",
        password: "superuser",
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!form.username || !form.password) {
            toast.error("All fields are required 😢");
            return;
        }

        try {
            setLoading(true);

            const res = await adminLogin(form);

            localStorage.removeItem("studentUser");
            localStorage.setItem("token", res.data.access);
            localStorage.setItem("refresh", res.data.refresh);
            localStorage.setItem("adminUser", true);

            toast.success(res.data.message || "Login successful 👍");

            navigate("/admin/dashboard");
        } catch (error) {
            toast.error(
                error?.response?.data?.message || "Invalid credentials 😢"
            );
        } finally {
            setLoading(false);
        }
    };

   return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-gray-100 to-blue-100">
        <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">

            <div>
                <h2 className="text-2xl font-semibold text-center mb-3">
                    <i className="fa-solid fa-shield-halved text-blue-500 mr-2"></i>Admin SignIn
                </h2>
                <p className="text-sm text-gray-500 mb-6 text-center">
                    Use the Admin Account Created via{" "}
                    <code className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs font-mono">
                        createsuperuser
                    </code>
                </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">

                <div>
                    <label className="block mb-1 text-sm text-gray-600 font-medium ">
                        Username
                    </label>
                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-400">
                        <span className="px-3 py-2.5 bg-white border-r border-gray-300 text-gray-500">
                            <i className="fa-regular fa-user text-sm"></i>
                        </span>
                        <input
                            type="text"
                            name="username"
                            placeholder="Enter username"
                            value={form.username}
                            onChange={handleChange}
                            className="flex-1 px-3 py-2.5 text-sm placeholder-gray-400 focus:outline-none"
                        />
                    </div>
                </div>

                <div>
                    <label className="block mb-1 text-sm text-gray-600 font-medium ">
                        Password
                    </label>
                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-400">
                        <span className="px-3 py-2.5 bg-white border-r border-gray-300 text-gray-500">
                            <i className="fa-solid fa-key text-sm"></i>
                        </span>
                        <input
                            type="password"
                            name="password"
                            placeholder="Enter password"
                            value={form.password}
                            onChange={handleChange}
                            className="flex-1 px-3 py-2.5 text-sm placeholder-gray-400 focus:outline-none"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-blue-500 text-white py-2.5 rounded-lg hover:bg-blue-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm mt-2"
                >
                    {loading ? (
                        <>
                            <span className="inline-block animate-spin text-base leading-none">↻</span>
                            Signing In...
                        </>
                    ) : (
                        <>
                            <i className="fa-solid fa-right-to-bracket" />
                            Sign In
                        </>
                    )}
                </button>

            </form>
        </div>
    </div>
);
};

export default AdminLogin;