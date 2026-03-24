import API from "./api"

export const getIssuedBooks = (params) =>
  API.get("admin/issue_book_list/", { params });

export const issueBook = (data) =>
  API.post("admin/book_issue/", data);

export const returnBook = (id, data) =>
  API.post(`admin/return_book/${id}/`, data);

export const getIssuedBookDetails = (id) =>
  API.get(`admin/issued_book_details/${id}/`);

export const getStudentIssueHistory = (id, data) =>
  API.get(`admin/student_history/${id}/`,data);