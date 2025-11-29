import { useState } from "react";
import axios from "axios";

export default function AdminLogin({ setToken }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const API = "https://krishna-portfolio-backend-ined.onrender.com/api/admin";

  const handleLogin = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${API}/login`,
        { username, password },
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("Login success response:", data);

      if (data?.token) {
        try {
          localStorage.setItem("token", data.token);
        } catch (e) {
          console.warn("Could not write token to localStorage:", e);
        }

        if (typeof setToken === "function") {
          try {
            setToken(data.token);
          } catch (e) {
            console.warn("setToken threw an error (ignored):", e);
          }
        }

        window.location.href = "/admin/dashboard";
        return;
      }

      alert(data?.message || "Login succeeded but no token returned");
    } catch (err) {
      console.error("Login error object (from frontend):", err);
      console.error("Response (if any):", err?.response);
      const serverMessage =
        err?.response?.data?.message || err?.response?.data?.error || "Login failed";
      alert(serverMessage);
    } finally {
      setLoading(false);
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
          className="w-full bg-blue-600 p-2 rounded hover:bg-blue-500 disabled:opacity-60"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
    </div>
  );
}