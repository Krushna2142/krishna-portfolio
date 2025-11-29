import { useState } from "react";
import axios from "axios";

export default function AdminLogin({ setToken }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const { data } = await axios.post(
        "https://krishna-portfolio-backend-ined.onrender.com/api/admin/login",
        { username, password },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      localStorage.setItem("token", data.token);
      setToken(data.token);

      window.location.href = "/admin/dashboard";
    } catch (err) {
      // Log full error for debugging in Console
      console.error("Login error object:", err);
      console.error("Response (if any):", err?.response);

      // Prefer server message, but fallback to server error key or generic text
      const serverMessage =
        err?.response?.data?.message || err?.response?.data?.error || "Login failed";

      alert(serverMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
      <div className="p-8 rounded-lg bg-gray-800 w-96">
        <h2 className="text-2xl mb-6">Admin Login</h2>

        <input
          type="text"
          placeholder="Username"
          className="w-full mb-4 p-2 rounded bg-gray-700"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-2 rounded bg-gray-700"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="w-full bg-blue-600 p-2 rounded hover:bg-blue-500"
          onClick={handleLogin}
        >
          Login
        </button>
      </div>
    </div>
  );
}