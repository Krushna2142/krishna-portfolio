/* eslint-disable no-unused-vars */
import { useEffect, useState, useRef, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import toast from "react-hot-toast";

const API_BASE =
  import.meta.env.VITE_BACKEND_URL ||
  "https://krishna-portfolio-backend-ined.onrender.com";

const API = `${API_BASE}/api/contact`;

export default function AdminDashboard() {
  const navigate = useNavigate();
  const socketRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [stats, setStats] = useState({ total: 0, today: 0, unread: 0 });
  const [loading, setLoading] = useState(true);

  /* =======================
     🔐 AUTH GUARD (CRITICAL)
  ======================== */
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/admin/login", { replace: true });
      return;
    }

    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    // Verify token by calling protected route
    axios
      .get(`${API}/stats`)
      .catch(() => {
        localStorage.removeItem("token");
        navigate("/admin/login", { replace: true });
      });
  }, [navigate]);

  /* =======================
     📥 FETCH DATA
  ======================== */
  const fetchAll = async () => {
    try {
      setLoading(true);

      const [msgRes, statRes] = await Promise.all([
        axios.get(API),
        axios.get(`${API}/stats`),
      ]);

      setMessages(msgRes.data.payload?.docs || []);
      setStats(statRes.data.payload);
    } catch (err) {
      handleAuthError(err);
    } finally {
      setLoading(false);
    }
  };

  /* =======================
     🔌 SOCKET.IO
  ======================== */
  useEffect(() => {
    fetchAll();

    const socket = io(API_BASE, {
      auth: {
        token: localStorage.getItem("token"),
      },
      transports: ["websocket"],
    });

    socketRef.current = socket;

    socket.on("message:created", (msg) => {
      setMessages((prev) => [msg, ...prev]);
      toast.success("New message received");
    });

    socket.on("message:updated", fetchAll);
    socket.on("message:deleted", fetchAll);

    return () => socket.disconnect();
  }, []);

  /* =======================
     🚪 LOGOUT
  ======================== */
  const handleLogout = () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    navigate("/admin/login", { replace: true });
  };

  /* =======================
     ❌ AUTH ERROR HANDLER
  ======================== */
  const handleAuthError = (err) => {
    if (err?.response?.status === 401) {
      handleLogout();
      toast.error("Session expired");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-800 p-4 rounded">Total: {stats.total}</div>
        <div className="bg-gray-800 p-4 rounded">Today: {stats.today}</div>
        <div className="bg-gray-800 p-4 rounded">Unread: {stats.unread}</div>
      </div>

      {loading ? (
        <p>Loading messages...</p>
      ) : (
        <div className="space-y-3">
          {messages.map((m) => (
            <div key={m._id} className="bg-gray-800 p-4 rounded">
              <p className="font-bold">{m.name}</p>
              <p className="text-sm text-gray-400">{m.email}</p>
              <p className="mt-2">{m.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
