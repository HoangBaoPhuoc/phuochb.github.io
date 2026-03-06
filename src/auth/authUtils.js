const STORAGE_KEY = "auth_token";
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ||
  "http://localhost:4000";

const buildAuthHeaders = (token) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
});

export const storeToken = (token) => {
  localStorage.setItem(STORAGE_KEY, token);
};

export const getStoredToken = () => {
  return localStorage.getItem(STORAGE_KEY);
};

export const removeToken = () => {
  localStorage.removeItem(STORAGE_KEY);
};

export const loginRequest = async (username, password) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Login failed");
  }

  return data;
};

export const getCurrentUser = async (token) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
    method: "GET",
    headers: buildAuthHeaders(token),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Unauthorized");
  }

  return data.user;
};

export const registerAccount = async (username, password) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Register failed");
  }

  return data;
};
