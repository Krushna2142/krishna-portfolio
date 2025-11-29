/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminLogin({ setToken }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = typeof useNavigate === "function" ? useNavigate() : null;

  const API = "https://krishna-portfolio-backend-ined.onrender.com/api/admin";

  const redirectToDashboard = () => {
    console.log("Redirecting to dashboard...");
    // Prefer client-side router if available
    try {
      if (navigate) {
        navigate("/admin/dashboard");
        return;
      }
    } catch (e) {
      console.warn("useNavigate failed:", e);
    }

    // Fallback
    try {
      window.location.href = "/admin/dashboard";
    } catch (e) {
      console.error("window.location redirect failed:", e);
    }
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${API}/login`,
        { username, password },
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("Login success response:", data);

      if (!data?.token) {
        alert(data?.message || "Login succeeded but no token returned");
        return;
      }

      // Save token reliably
      try {
        localStorage.setItem("token", data.token);
        console.log("Token saved to localStorage");
      } catch (e) {
        console.warn("Could not write token to localStorage:", e);
      }

      // Call setToken if safe
      if (typeof setToken === "function") {
        try {
          setToken(data.token);
          console.log("setToken called");
        } catch (e) {
          console.warn("setToken threw an error (ignored):", e);
        }
      } else {
        console.log("setToken not provided or not a function; skipping");
      }

      // Redirect after token stored
      redirectToDashboard();
    } catch (err) {
      console.error("Login error (frontend):", err);
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