import API from "./api"

export const getBooks = (data) =>
  API.get("list-books/", data);

export const addBook = (data) =>
  API.post("admin/add-book/", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const updateBook = (id, data) =>
  API.put(`admin/update-book/${id}/`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const deleteBook = (id) =>
  API.delete(`admin/delete-book/${id}/`);


export const getBooklookup = (params) =>
  API.get("admin/books/lookup/", { params });