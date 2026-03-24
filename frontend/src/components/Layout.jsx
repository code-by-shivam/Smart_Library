import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Layout = () => {
    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            <Header />
            <main className="flex-1">
                <Outlet />
            </main>
            <Footer />
            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
};

export default Layout;