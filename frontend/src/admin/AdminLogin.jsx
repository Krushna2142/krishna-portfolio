import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { setAxiosToken } from "../setupAxios";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const API_BASE =
    import.meta.env.VITE_BACKEND_URL ||
    "https://krishna-portfolio-backend-ined.onrender.com";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post(
        `${API_BASE}/api/admin/login`,
        { username, password },
        { headers: { "Content-Type": "application/json" } }
      );

      if (!data?.token) {
        alert("Login failed");
        return;
      }

      // Save token + set axios header
      setAxiosToken(data.token);

      // Redirect securely
      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      alert(err?.response?.data?.message || "Invalid credentials");
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
            type="text"
            placeholder="Username"
            className="w-full mb-4 p-2 rounded bg-gray-700"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full mb-4 p-2 rounded bg-gray-700"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 p-2 rounded hover:bg-blue-500 disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
