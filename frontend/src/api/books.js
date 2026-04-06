import { apiFetch } from "./client.js";

export const getBooks = async ({ signal } = {}) => {
  return apiFetch("/books", { signal });
};

export const getBook = async (id, { signal } = {}) => {
  return apiFetch(`/books/${id}`, { signal });
};

export const createBook = async (payload) => {
  return apiFetch("/books", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
};

export const updateBook = async (id, payload) => {
  return apiFetch(`/books/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
};

export const deleteBook = async (id) => {
  return apiFetch(`/books/${id}`, {
    method: "DELETE",
  });
};
