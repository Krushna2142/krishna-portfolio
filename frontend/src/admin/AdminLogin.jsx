// src/pages/AdminLogin.jsx
import { useState } from "react";
import axios from "axios";

const API_URL = "https://krishna-portfolio-backend-ined.onrender.com/api/admin";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post(`${API_URL}/login`, {
        username,
        password,
      });

      if (!data?.token) {
        alert("Login failed: no token returned");
        setLoading(false);
        return;
      }

      localStorage.setItem("adminToken", data.token);
      window.location.replace("/admin/dashboard"); // redirect
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Invalid Admin Credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
      <div className="p-8 rounded-lg bg-gray-800 w-96 shadow-xl">
        <h2 className="text-3xl mb-6 font-semibold text-center">Admin Login</h2>

        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            className="w-full p-2 mb-4 rounded bg-gray-700"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 mb-4 rounded bg-gray-700"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 p-2 rounded disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
