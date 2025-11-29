import { useState } from "react";
import axios from "axios";

/**
 * AdminLogin (now includes registration mode)
 *
 * - Toggle between "Login" and "Register" in the same UI.
 * - Register sends POST /api/admin/register with { username, password }.
 * - Login sends POST /api/admin/login with { username, password }.
 * - Shows server message (err?.response?.data?.message) when available.
 *
 * IMPORTANT:
 * - Keep registration enabled only long enough to create your admin user.
 *   After creating the admin, remove/disable this UI or protect the register route
 *   on the backend (so random people can't create admin accounts).
 */

export default function AdminLogin({ setToken }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("login"); // "login" or "register"
  const [loading, setLoading] = useState(false);

  const API_BASE =
    "https://krishna-portfolio-backend-ined.onrender.com/api/admin";

  const handleLogin = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        `${API_BASE}/login`,
        { username, password },
        { headers: { "Content-Type": "application/json" } }
      );

      if (data?.token) {
        localStorage.setItem("token", data.token);
        setToken(data.token);
        // Redirect to dashboard
        window.location.href = "/admin/dashboard";
      } else {
        // If server responded success but no token, show message
        alert(data?.message || "Login succeeded but no token returned");
      }
    } catch (err) {
      console.error("Login error:", err);
      const serverMessage =
        err?.response?.data?.message || err?.response?.data?.error || "Login failed";
      alert(serverMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    try {
      if (!username || !password) {
        alert("Please enter both username and password");
        return;
      }

      setLoading(true);
      const { data } = await axios.post(
        `${API_BASE}/register`,
        { username, password },
        { headers: { "Content-Type": "application/json" } }
      );

      // server should send a message like { message: "Admin created" }
      alert(data?.message || "Registration response received");

      // After registration, switch to login mode automatically
      setMode("login");
      setPassword(""); // clear password field
    } catch (err) {
      console.error("Register error:", err);
      const serverMessage =
        err?.response?.data?.message || err?.response?.data?.error || "Registration failed";
      alert(serverMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === "login") handleLogin();
    else handleRegister();
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
      <div className="p-8 rounded-lg bg-gray-800 w-96">
        <h2 className="text-2xl mb-4">{mode === "login" ? "Admin Login" : "Register Admin"}</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            className="w-full mb-4 p-2 rounded bg-gray-700"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full mb-4 p-2 rounded bg-gray-700"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={mode === "login" ? "current-password" : "new-password"}
          />

          <button
            type="submit"
            className="w-full bg-blue-600 p-2 rounded hover:bg-blue-500 disabled:opacity-60"
            disabled={loading}
          >
            {loading ? (mode === "login" ? "Logging in..." : "Registering...") : mode === "login" ? "Login" : "Register"}
          </button>
        </form>

        <div className="mt-4 text-center">
          {mode === "login" ? (
            <>
              <span className="text-sm mr-2">Don't have an admin account?</span>
              <button
                className="text-sm underline"
                onClick={() => setMode("register")}
              >
                Register here
              </button>
            </>
          ) : (
            <>
              <span className="text-sm mr-2">Already have an admin account?</span>
              <button
                className="text-sm underline"
                onClick={() => setMode("login")}
              >
                Login here
              </button>
            </>
          )}
        </div>

        <div className="mt-6 text-xs text-gray-400">
          Note: After creating your admin, remove or hide the registration option to avoid
          public admin signups.
        </div>
      </div>
    </div>
  );
}