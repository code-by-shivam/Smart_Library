import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useState, useRef, useEffect } from "react";
import api from "../utils/api"; 


function Header() {
    const location = useLocation();
    const navigate = useNavigate();
   
    const [openDropdown, setOpenDropdown] = useState(null);

    const adminUser = localStorage.getItem("adminUser");
    const studentUser = localStorage.getItem("studentUser");
    const dropdownRef = useRef();


    const handleLogout = async () => {
        try {
            await api.post("logout/");
        } catch (error) {
            console.error(error);
        }

        localStorage.removeItem("adminUser");
        localStorage.removeItem("studentUser");
        localStorage.removeItem("token");
        localStorage.removeItem("refresh");
        toast.success("Admin logged out 👋");
        navigate("/admin/login");
    };

    const handleStudentLogout = async () => {
        try {
            await api.post("logout/");
        } catch (error) {
            console.error(error);
        }
        localStorage.removeItem("studentUser");
        localStorage.removeItem("adminUser");
        localStorage.removeItem("token");
        localStorage.removeItem("refresh");
        toast.success("Student logged out 👋");
        navigate("/student/login");
    };

    const isActive = (path) =>
        location.pathname === path ? "text-blue-500 font-semibold" : "";


    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpenDropdown(null); 
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <nav className="bg-white shadow sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-5 py-3 flex justify-between items-center">

                <Link
                    to={adminUser ? "/admin/dashboard" : studentUser ? "/student/dashboard" : "/"}
                    className="flex items-center gap-2 text-lg font-bold text-gray-800 hover:text-blue-500 transition"
                >
                    <span className="text-blue-500 text-xl">
                        <i className="fa-solid fa-book-open-reader" />
                    </span>
                    <span>Smart Library</span>
                </Link>

                <div ref={dropdownRef} className="flex items-center gap-5">


                    {!adminUser && !studentUser && (
                        <>
                            <Link className={isActive("/")} to="/"> <i className="fa-solid fa-house mr-1" />Home</Link>
                            <Link className={isActive("/student/login")} to="/student/login"> <i className="fa-solid fa-user mr-1" />Student Login</Link>
                            <Link className={isActive("/student/signup")} to="/student/signup"> <i className="fa-solid fa-user-plus mr-1" />Student Signup</Link>
                            <Link className="bg-blue-500 text-white px-3 py-1 rounded" to="/admin/login">
                                <i className="fa-solid fa-user-shield mr-1" />Admin Login
                            </Link>
                        </>
                    )}


                    {adminUser && (
                        <>
                            <Link className={isActive("/admin/dashboard")} to="/admin/dashboard">
                                <i className="fa-solid fa-gauge-high mr-1" />Dashboard
                            </Link>


                            <div className="relative">
                                <button
                                    onClick={() => setOpenDropdown(openDropdown === "category" ? null : "category")}
                                >
                                    <i className="fa-solid fa-layer-group mr-1" /> Categories ▾
                                </button>

                                {openDropdown === "category" && (
                                    <div className="absolute right-0 mt-2 bg-white shadow rounded w-45">
                                        <Link className="block px-3 py-2 hover:bg-gray-100" to="/admin/add-category">
                                            <i className="fa-solid fa-plus mr-1" />Add Category
                                        </Link>
                                        <Link className="block px-3 py-2 hover:bg-gray-100" to="/admin/manage-category">
                                            <i className="fa-solid fa-list mr-1" />Manage Category
                                        </Link>
                                    </div>
                                )}
                            </div>
                            <div className="relative">
                                <button
                                    onClick={() => setOpenDropdown(openDropdown === "author" ? null : "author")}
                                    className=""
                                >
                                    <i className="fa-solid fa-user-pen mr-1" /> Authors ▾
                                </button>

                                {openDropdown === "author" && (
                                    <div className="absolute right-0 mt-2 bg-white shadow rounded w-40">
                                        <Link className="block px-3 py-2 hover:bg-gray-100" to="/admin/add-author">
                                            <i className="fa-solid fa-plus mr-1" />Add Author
                                        </Link>
                                        <Link className="block px-3 py-2 hover:bg-gray-100" to="/admin/manage-author">
                                            <i className="fa-solid fa-list mr-1" />Manage Author
                                        </Link>
                                    </div>
                                )}
                            </div>
                            <div className="relative">
                                <button
                                    onClick={() => setOpenDropdown(openDropdown === "book" ? null : "book")}
                                    className=""
                                >
                                    <i className="fa-solid fa-book mr-1" /> Books ▾
                                </button>

                                {openDropdown === "book" && (
                                    <div className="absolute right-0 mt-2 bg-white shadow rounded w-40">
                                        <Link className="block px-3 py-2 hover:bg-gray-100" to="/admin/add-book">
                                            <i className="fa-solid fa-plus mr-1" /> Add Book
                                        </Link>
                                        <Link className="block px-3 py-2 hover:bg-gray-100" to="/admin/manage-book">
                                            <i className="fa-solid fa-list mr-1" /> Manage Book
                                        </Link>
                                        <Link className="block px-3 py-2 hover:bg-gray-100" to="/admin/issued-books">
                                            <i className="fa-solid fa-book mr-1" /> Issued Books
                                        </Link>
                                    </div>
                                )}

                            </div>



                            <Link className={isActive("/admin/issue-book")} to="/admin/issue-book">
                                <i className="fa-solid fa-right-from-bracket mr-1" />Issue Book
                            </Link>
                            <Link className={isActive("/admin/manage-students")} to="/admin/manage-students">
                                <i className="fa-solid fa-user-group mr-1" />Students
                            </Link>
                            <Link className={isActive("/admin/change-password")} to="/admin/change-password">
                                <i className="fa-solid fa-key mr-1" />Change Password
                            </Link>



                            <button
                                onClick={handleLogout}
                                className="bg-red-500 text-white px-3 py-1 rounded"
                            >
                                Logout
                            </button>
                        </>
                    )}

                    {/* Student */}
                    {studentUser && (
                        <>
                            <Link className={isActive("/student/dashboard")} to="/student/dashboard">
                            <i className="fa-solid fa-gauge mr-1" />Dashboard</Link>
                            <Link className={isActive("/student/books")} to="/student/books">
                                <i className="fa-solid fa-book-open mr-1" />My Library
                            </Link>
                            <Link className={isActive("/student/issue-history")} to="/student/issue-history">
                                <i className="fa-solid fa-book mr-1" />Issued Books
                            </Link>
                            <div className="relative">
    <button
        onClick={() => setOpenDropdown(openDropdown === "account" ? null : "account")}
        className="flex items-center gap-1"
    >
        <i className='fa-solid fa-circle-user mr-1' />
        My Account ▾
    </button>

    {openDropdown === "account" && (
        <div className="absolute right-0 mt-2 bg-white shadow rounded w-48 z-50">
            <Link className="block px-3 py-2 hover:bg-gray-100" to="/student/profile">
                <i className='fa-solid fa-id-badge mr-1' />
                Profile
            </Link>
            <Link className="block px-3 py-2 hover:bg-gray-100" to="/student/change-password">
                <i className='fa-solid fa-key mr-1' />
                Change Password
            </Link>
            <hr className="border-gray-200 my-1" />
            <button
                type="button"
                className="w-full text-center px-3 py-2 hover:bg-gray-100 text-red-500"
                onClick={handleStudentLogout}
            >
                <i className='fa-solid fa-right-from-bracket mr-1' />
                Logout
            </button>
        </div>
    )}
</div>

                            
                        </>
                    )}

                </div>
            </div>
        </nav>
    );
}

export default Header;