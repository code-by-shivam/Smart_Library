import API from "./api"

export const getStudents = (params) =>
  API.get("admin/students_list/", { params });

export const blockStudent = (id) =>
  API.put(`admin/students_block/${id}/`);

export const unblockStudent = (id) =>
  API.put(`admin/students_unblock/${id}/`);


export const getStudentById = (studentId) =>
  API.get(`admin/student/by-id/${studentId}/`);

export const changePassword = (data) =>
  API.post("change-password/", data);

export const adminDashboardStats = () =>
  API.get("admin/dashboard_stats/");


export const studentSignup = (data) =>
  API.post("student/signup/", data);

export const studentStats = () =>
  API.get("student/stats/");

export const studentIssueHistory = (params) =>
  API.get("student/issue_history/", { params });

export const studentProfile = (data) =>
  API.get("student/profile/", data);

export const updateStudentProfile = (data) =>
  API.put("student/profile/", data);

export const homedata = (data) => 
  API.get("homepage/stats/", data);