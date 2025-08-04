export const API_BASE_URL: string =
  import.meta.env.VITE_SERVER_URL || "http://localhost:5050";

const endpoints = {
  users: "/auth",
};

export default endpoints;
