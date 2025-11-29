import { useState } from "react";
import axios from "axios";

/**
 * Robust AdminLogin
 * - Stores token in localStorage
 * - Calls setToken if provided (safely)
 * - Forces full page navigation / reload so app can re-read token from storage
 * - Logs every step to console for debugging
 *
 * NOTE: After verifying that login + redirect works, you can remove some console.log calls.
 */

export default function AdminLogin({ setToken }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const API = "https://krishna-portfolio-backend-ined.onrender.com/api/admin";

  const redirectToDashboard = () => {
    console.log("redirectToDashboard: attempting client-side router redirect...");

    // Try client-side router navigation if available (React Router's navigate function is not
    // imported here, so we try a fallback: change history via pushState then reload).
    try {
      // If your app uses client-side routing and expects a soft navigation, setting location
      // will still work; we force a reload to ensure auth state is picked up on mount.
      window.location.replace("/admin/dashboard");
      // If replace succeeds, code below won't run. We leave logs in case browser blocks.
    } catch (err) {
      console.warn("redirectToDashboard: window.location.replace failed:", err);
      try {
        window.location.href = "/admin/dashboard";
      } catch (err2) {
        console.error("redirectToDashboard: window.location.href failed:", err2);
      }
    }
  };

  const handleLogin = async () => {
    setLoading(true);
    console.log("handleLogin: starting login for user:", username);
    try {
      const { data } = await axios.post(
        `${API}/login`,
        { username, password },
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("handleLogin: response data:", data);

      if (!data || !data.token) {
        console.warn("handleLogin: no token in response; showing message");
        alert(data?.message || "Login failed: no token returned");
        setLoading(false);
        return;
      }

      // Save to localStorage first
      try {
        localStorage.setItem("token", data.token);
        console.log("handleLogin: token saved to localStorage");
      } catch (e) {
        console.warn("handleLogin: could not save token to localStorage:", e);
      }

      // Call setToken if passed and safe
      if (typeof setToken === "function") {
        try {
          setToken(data.token);
          console.log("handleLogin: setToken called");
        } catch (e) {
          console.warn("handleLogin: setToken threw an error (ignored):", e);
        }
      } else {
        console.log("handleLogin: setToken prop not provided or not a function");
      }

      // Force navigation to dashboard (full reload) so the app will re-run auth init code
      console.log("handleLogin: redirecting to /admin/dashboard (full reload) ...");
      // Give a tiny delay so logs flush
      setTimeout(() => {
        redirectToDashboard();
      }, 150);
    } catch (err) {
      console.error("handleLogin: caught error:", err);
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