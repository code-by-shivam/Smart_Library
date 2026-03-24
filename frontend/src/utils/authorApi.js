import API from "./api" 

export const getAuthors = (data) =>
  API.get("admin/list-authors/", data);

export const addAuthor = (data) =>
  API.post("admin/add-author/", data);

export const updateAuthor = (id, data) =>
  API.put(`admin/update-author/${id}/`, data);

export const deleteAuthor = (id) =>
  API.delete(`admin/delete-author/${id}/`);