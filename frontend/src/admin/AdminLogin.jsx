import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { setAxiosToken } from "../setupAxios";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const API = "https://krishna-portfolio-backend-ined.onrender.com/api/admin";

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${API}/login`,
        { username, password },
        { headers: { "Content-Type": "application/json" } }
      );

      if (!data?.token) {
        alert(data?.message || "Login failed: no token returned");
        setLoading(false);
        return;
      }

      // Persist token and set axios Authorization header immediately
      setAxiosToken(data.token);

      // Navigate to dashboard (client-side)
      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      console.error("Login error:", err);
      alert(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
      <div className="p-8 rounded-lg bg-gray-800 w-96">
        <h2 className="text-2xl mb-6">Admin Login</h2>

        <form onSubmit={handleSubmit}>
          <input
            name="username"
            type="text"
            placeholder="Username"
            autoComplete="username"
            className="w-full mb-4 p-2 rounded bg-gray-700"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            autoComplete="current-password"
            className="w-full mb-4 p-2 rounded bg-gray-700"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            className="w-full bg-blue-600 p-2 rounded hover:bg-blue-500 disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}