import api from "./api";


export async function registerUser(email, password) {
  const response = await api.post("/auth/register", {
    email,
    password
  });

  return response.data;
}


export async function loginUser(email, password) {
  const response = await api.post("/auth/login", {
    email,
    password
  });

  localStorage.setItem(
    "access_token",
    response.data.access_token
  );

  return response.data;
}


export async function getCurrentUser() {
  const response = await api.get("/auth/me");

  return response.data;
}


export function logoutUser() {
  localStorage.removeItem("access_token");
}


export function isAuthenticated() {
  return Boolean(
    localStorage.getItem("access_token")
  );
}