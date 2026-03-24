import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  const currentYear = new Date().getFullYear();
  const appName = "Smart Library";
  

  return (
    <footer className="bg-slate-950 text-gray-400 text-sm py-4">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-3">

        
        <p className="text-center md:text-left">
          © {currentYear}{" "}
          <span className="text-blue-500 font-semibold">
            {appName}
          </span>. Built with Django & React.
        </p>

        
        <div className="flex gap-4">

          <Link
            to="https://github.com/code-by-shivam"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-gray-300 hover:text-white transition"
          >
            <i className="fa-brands fa-github"></i>
            GitHub
          </Link>

          <Link
            to="https://www.google.com/"
            className="flex items-center gap-1 text-gray-300 hover:text-white transition"
          >
            <i className="fa-solid fa-circle-info"></i>
            About
          </Link>

        </div>

      </div>
    </footer>
  );
}

export default Footer;