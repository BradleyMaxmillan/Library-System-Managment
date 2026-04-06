import { apiFetch } from "./client.js";

export const registerUser = async (payload) => {
  return apiFetch("/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
};

export const loginUser = async (payload) => {
  return apiFetch("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
};

export const fetchMe = async () => {
  return apiFetch("/auth/me");
};
