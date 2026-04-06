const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const handleResponse = async (res) => {
  if (!res.ok) {
    let message = "Request failed";
    try {
      const data = await res.json();
      if (data?.message) message = data.message;
    } catch {
      // ignore JSON parse errors
    }
    const error = new Error(message);
    error.status = res.status;
    throw error;
  }
  return res.json();
};

const getToken = () => {
  try {
    return localStorage.getItem("token");
  } catch {
    return null;
  }
};

export const apiFetch = async (path, options = {}) => {
  const token = getToken();
  const headers = {
    ...(options.headers || {}),
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });
  return handleResponse(res);
};
