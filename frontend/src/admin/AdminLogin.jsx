import { useState } from "react";
import axios from "axios";

/**
 * AdminLogin (form-based)
 * - inputs are inside <form> so Enter submits and password managers behave
 * - name and autoComplete attributes added
 * - saves token, calls setToken safely, forces replace() to /admin/dashboard
 * - console.logs every step for debugging
 */

export default function AdminLogin({ setToken }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const API = "https://krishna-portfolio-backend-ined.onrender.com/api/admin";

  const redirectToDashboard = () => {
    console.log("redirectToDashboard: forcing navigation to /admin/dashboard");
    // Use replace to avoid back button clutter
    window.location.replace("/admin/dashboard");
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setLoading(true);
    console.log("handleLogin: starting for username:", username);

    try {
      const { data } = await axios.post(
        `${API}/login`,
        { username, password },
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("handleLogin: response data:", data);

      if (!data?.token) {
        console.warn("handleLogin: no token in response; showing message");
        alert(data?.message || "Login failed: no token returned");
        setLoading(false);
        return;
      }

      try {
        localStorage.setItem("token", data.token);
        console.log("handleLogin: token saved to localStorage");
      } catch (err) {
        console.warn("handleLogin: failed to write token to localStorage:", err);
      }

      if (typeof setToken === "function") {
        try {
          setToken(data.token);
          console.log("handleLogin: setToken called");
        } catch (err) {
          console.warn("handleLogin: setToken threw error (ignored):", err);
        }
      } else {
        console.log("handleLogin: setToken not provided or not a function");
      }

      // small delay ensures logs flush in console
      setTimeout(() => redirectToDashboard(), 120);
    } catch (err) {
      console.error("handleLogin: request error:", err);
      console.error("handleLogin: response (if any):", err?.response?.data || err?.response);
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