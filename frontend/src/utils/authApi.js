import API from "./api"

export const adminLogin = (data) => API.post("admin/login/", data);
export const studentLogin = (data) => API.post("student/login/", data);

export const refreshToken = (data) => API.post("refresh/", data);