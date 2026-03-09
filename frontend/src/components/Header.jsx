import { Link, useLocation, useNavigate } from "react-router-dom"
function Header() {
    const location = useLocation();
    const adminUser = localStorage.getItem("adminUser");
    const navigate = useNavigate();
    const handleLogout = () => {
    localStorage.removeItem("adminUser");
    navigate("/admin/login", { replace: true });
}
    const isActive = (path) => {
        return location.pathname === path ? "active text-primary fw-semibold" : "";
    }
    return (
        <>
            <nav className="navbar navbar-expand-lg bg-white border-bottom shadow-sm sticky-top">
                <div className="container">
                    <Link className="navbar-brand d-flex align-items-center gap-2 " to="/">
                        <span>
                            <i className='fa-solid fa-book-open-reader'></i>
                        </span>
                        <span className='fw-bold'>Smart Library</span>
                    </Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                            {!adminUser && (
                                <>
                                    <li className="nav-item">
                                        <Link className={`nav-link ${isActive("/")}`} to="/">
                                            <i className='fa-solid fa-home me-1' />
                                            Home</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className={`nav-link ${isActive("/user/login")}`} to="/user/login">
                                            <i className='fa-solid fa-user me-1' />
                                            User Login</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className={`nav-link ${isActive("/user/signup")}`} to="/user/signup">
                                            <i className='fa-solid fa-user-plus me-1' />
                                            User Signup</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="btn btn-primary" to="/admin/login">
                                            <i className='fa-solid fa-shield-halved me-1' />
                                            Admin Login</Link>
                                    </li>
                                </>)}



                            {adminUser && (
                                <>
                                    <li className="nav-item">
                                        <Link className={`nav-link ${isActive("/user/signup")}`} to="/admin/dashboard">
                                            <i className='fa-solid fa-gauge-high me-1' />
                                            Dashboard</Link>
                                    </li>
                                    <li className="nav-item dropdown">
                                        <button className='nav-link dropdown-toggle btn btn-link' data-bs-toggle="dropdown">
                                            <i className='fa-solid fa-layer-group me-1' />
                                            Categories
                                        </button>
                                        <ul className='dropdown-menu dropdown-menu-end'>
                                            <li>
                                                <Link className="dropdown-item" to="/admin/add_Category">
                                                    <i className='fa-solid fa-plus me-1' />
                                                    Add Category</Link>
                                            </li>
                                            <li>
                                                <Link className="dropdown-item" to="/admin/add_Category">
                                                    <i className='fa-solid fa-list me-1' />
                                                    Manage Category</Link>
                                            </li>

                                        </ul>

                                    </li>
                                    <li className="nav-item dropdown">
                                        <button className='nav-link dropdown-toggle btn btn-link' data-bs-toggle="dropdown">
                                            <i className='fa-solid fa-user-pen me-1' />
                                            Authors
                                        </button>
                                        <ul className='dropdown-menu dropdown-menu-end'>
                                            <li>
                                                <Link className="dropdown-item" to="/admin/add_Category">
                                                    <i className='fa-solid fa-plus me-1' />
                                                    Add Author</Link>
                                            </li>
                                            <li>
                                                <Link className="dropdown-item" to="/admin/add_Category">
                                                    <i className='fa-solid fa-list me-1' />
                                                    Manage Author</Link>
                                            </li>

                                        </ul>

                                    </li>
                                    <li className="nav-item dropdown">
                                        <button className='nav-link dropdown-toggle btn btn-link' data-bs-toggle="dropdown">
                                            <i className='fa-solid fa-books me-1' />
                                            Books
                                        </button>
                                        <ul className='dropdown-menu dropdown-menu-end'>
                                            <li>
                                                <Link className="dropdown-item" to="/admin/add_Category">
                                                    <i className='fa-solid fa-plus me-1' />
                                                    Add Book</Link>
                                            </li>
                                            <li>
                                                <Link className="dropdown-item" to="/admin/add_Category">
                                                    <i className='fa-solid fa-list me-1' />
                                                    Manage Book</Link>
                                            </li>
                                            <li>
                                                <Link className="dropdown-item" to="/admin/add_Category">
                                                    <i className='fa-solid fa-arrow-right-arrow-left me-1' />
                                                    Issued Book</Link>
                                            </li>

                                        </ul>

                                    </li>
                                    <li className="nav-item">
                                        <Link className={`nav-link ${isActive("/user/signup")}`} to="/admin/dashboard">
                                            <i className='fa-solid fa-right-from-bracket me-1' />
                                            Issue Book</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className={`nav-link ${isActive("/user/signup")}`} to="/admin/dashboard">
                                            <i className='fa-solid fa-gauge-high me-1' />
                                            Students</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className={`nav-link ${isActive("/user/signup")}`} to="/admin/dashboard">
                                            <i className='fa-solid fa-key me-1' />
                                            Change Password</Link>
                                    </li>
                                    <li className="nav-item">
                                        <button className="btn btn-outline-danger" onClick={handleLogout}>
    <i className='fa-solid fa-right-from-bracket me-1' />
    Logout
</button>
                                    </li>

                                </>
                            )}
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    )
}

export default Header