const STORAGE_KEY = "auth_token";

const resolveApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL?.trim();
  if (envUrl) {
    return envUrl.replace(/\/$/, "");
  }

  // Safe fallback for deployed frontend when secret injection is missing.
  if (
    typeof window !== "undefined" &&
    window.location.hostname !== "localhost" &&
    window.location.hostname !== "127.0.0.1"
  ) {
    return "https://phuochb-github-io.onrender.com";
  }

  return "http://localhost:4000";
};

const API_BASE_URL = resolveApiBaseUrl();

const buildAuthHeaders = (token) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
});

export const storeToken = (token) => {
  localStorage.setItem(STORAGE_KEY, token);
};

export const getStoredToken = () => {
  const token = localStorage.getItem(STORAGE_KEY);
  console.log("🔑 getStoredToken called:", token ? "Token exists" : "No token");
  return token;
};

export const removeToken = () => {
  console.log("🗑️ removeToken called - Token being removed!");
  console.trace(); // Show stack trace to see who called this
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
  console.log(
    "👤 getCurrentUser called with token:",
    token?.substring(0, 20) + "...",
  );

  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
      method: "GET",
      headers: buildAuthHeaders(token),
    });

    console.log("👤 getCurrentUser response status:", response.status);

    const data = await response.json();
    if (!response.ok) {
      console.error("👤 getCurrentUser failed:", data.message);
      throw new Error(data.message || "Unauthorized");
    }

    console.log("👤 getCurrentUser success:", data.user);
    return data.user;
  } catch (error) {
    console.error("👤 getCurrentUser error:", error);
    throw error;
  }
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
