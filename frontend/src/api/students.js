import { apiFetch } from "./client.js";

export const getStudents = async ({ signal } = {}) => {
  return apiFetch("/students", { signal });
};

export const getStudent = async (id, { signal } = {}) => {
  return apiFetch(`/students/${id}`, { signal });
};

export const createStudent = async (payload) => {
  return apiFetch("/students", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
};

export const updateStudent = async (id, payload) => {
  return apiFetch(`/students/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
};

export const deleteStudent = async (id) => {
  return apiFetch(`/students/${id}`, {
    method: "DELETE",
  });
};
