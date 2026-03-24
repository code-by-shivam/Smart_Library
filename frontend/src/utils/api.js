import axios from "axios";


const API_URL = import.meta.env.VITE_API_URL;


const API = axios.create({
  baseURL: `${API_URL}/api/`,
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token && !req.url.includes("login")) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/admin/login";
    }
    return Promise.reject(err);
  }
);

export default API;