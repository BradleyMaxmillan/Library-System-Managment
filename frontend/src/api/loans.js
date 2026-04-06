import { apiFetch } from "./client.js";

export const getLoans = async ({ signal } = {}) => {
  return apiFetch("/loans", { signal });
};

export const getLoanAnalytics = async ({ signal } = {}) => {
  return apiFetch("/loans/analytics/overview", { signal });
};

export const createLoan = async (payload) => {
  return apiFetch("/loans", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
};

export const returnLoan = async (id) => {
  return apiFetch(`/loans/${id}/return`, {
    method: "PATCH",
  });
};
