import API from "./api"

// GET (pagination + filter)
export const getCategories = (data) =>
  API.get("admin/categories/", data);

// ADD
export const addCategory = (data) =>
  API.post("admin/add-Category/", data);

// UPDATE
export const updateCategory = (id, data) =>
  API.put(`admin/update-category/${id}/`, data);

// DELETE
export const deleteCategory = (id) =>
  API.delete(`admin/delete-category/${id}/`);