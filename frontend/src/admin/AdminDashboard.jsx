/* eslint-disable no-unused-vars */
import { useEffect, useMemo, useState, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import {
  LogOut,
  Inbox,
  BarChart2,
  Menu,
  Search,
  Trash2,
  CheckCircle2,
  RefreshCcw,
  Eye,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

import MessageCard from "../components/MessageCard";
import MessageModal from "../components/MessageModal";
import MessageSkeleton from "../components/MessageSkeleton";

const API_BASE = import.meta.env.VITE_BACKEND_URL || "https://krishna-portfolio-backend-ined.onrender.com";
const API = `${API_BASE}/api/contact`;

export default function AdminDashboard({ token: tokenProp }) {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [stats, setStats] = useState({ total: 0, today: 0, unread: 0 });
  const [chartData, setChartData] = useState([]);
  const [openSidebar, setOpenSidebar] = useState(false);
  const [loading, setLoading] = useState(true);

  // UI state
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all"); // all / unread / read
  const [page, setPage] = useState(1);
  const perPage = 10;
  const [selected, setSelected] = useState(null); // message for modal
  const socketRef = useRef(null);

  // set axios auth header from tokenProp or localStorage
  useEffect(() => {
    const token = tokenProp || localStorage.getItem("token");
    if (token) axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    else delete axios.defaults.headers.common["Authorization"];
  }, [tokenProp]);

  const unwrap = (res) => {
    const d = res?.data ?? null;
    if (d == null) return null;
    if (d.payload !== undefined) return d.payload;
    return d;
  };

  const fetchMessages = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await axios.get(`${API}?page=${page}&perPage=${perPage}`);
      const payload = unwrap(res);
      // payload: { docs, total, page, perPage, totalPages }
      const docs = payload?.docs ?? [];
      setMessages(docs);
      // update paging information if you store it
      // optionally set total pages state if you want server-driven paging
    } catch (err) {
      handleAuthError(err);
      toast.error("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API}/stats`);
      const payload = unwrap(res) ?? {};
      setStats({
        total: payload?.total ?? 0,
        today: payload?.today ?? 0,
        unread: payload?.unread ?? 0,
      });
    } catch (err) {
      handleAuthError(err);
    }
  };

  const fetchChart = async () => {
    try {
      const res = await axios.get(`${API}/chart/daily`);
      const payload = unwrap(res) ?? [];
      // convert _id YYYY-MM-DD to nicer label if needed
      const c = Array.isArray(payload) ? payload.map(p => ({ ...p })) : [];
      setChartData(c);
    } catch (err) {
      if (err?.response?.status === 404) {
        setChartData([]);
        return;
      }
      handleAuthError(err);
    }
  };

  const fullRefresh = async () => {
    await Promise.all([fetchMessages(true), fetchStats(), fetchChart()]);
  };

  // Socket.IO connection replaces polling
  useEffect(() => {
    fullRefresh();

    // Socket.IO connection
    const SOCKET_URL = API_BASE; // same host
    const socket = io(SOCKET_URL, {
      transports: ["websocket"],
      auth: {
        token: localStorage.getItem("token") || tokenProp || null,
      },
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Socket connected", socket.id);
    });

    socket.on("message:created", (msg) => {
      // Prepend new message
      setMessages(prev => [msg, ...prev]);
      setStats(prev => ({ ...prev, total: prev.total + 1, today: prev.today + 1, unread: prev.unread + 1 }));
      toast.success("New message received");
    });

    socket.on("message:updated", (msg) => {
      setMessages(prev => prev.map(m => (m._id === msg._id ? msg : m)));
      fetchStats();
    });

    socket.on("message:deleted", ({ _id }) => {
      setMessages(prev => prev.filter(m => m._id !== _id));
      fetchStats();
    });

    socket.on("disconnect", () => console.log("Socket disconnected"));

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
      socketRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-fetch messages when page changes
  useEffect(() => {
    fetchMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleAuthError = (err) => {
    if (err?.response?.status === 401) {
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["Authorization"];
      navigate("/admin/login", { replace: true });
      toast.error("Session expired. Please login again.");
    } else {
      console.error("API error:", err);
    }
  };

  // optimistic mark read
  const markRead = async (id) => {
    const prev = messages;
    setMessages(prev.map(m => (m._id === id ? { ...m, read: true } : m)));
    try {
      await axios.put(`${API}/read/${id}`, {});
      await fetchStats();
      toast.success("Marked as read");
    } catch (err) {
      setMessages(prev);
      handleAuthError(err);
      toast.error("Failed to mark read");
    }
  };

  const deleteMessage = async (id) => {
    const prev = messages;
    setMessages(prev.filter(m => m._id !== id));
    try {
      await axios.delete(`${API}/${id}`);
      await fetchStats();
      await fetchChart();
      toast.success("Deleted message");
    } catch (err) {
      setMessages(prev);
      handleAuthError(err);
      toast.error("Delete failed");
    }
  };

  const markAllRead = async () => {
    // helper: mark visible unread as read (sequential)
    const unread = messages.filter(m => !m.read).map(m => m._id);
    await Promise.all(unread.map(id => axios.put(`${API}/read/${id}`, {})));
    await fullRefresh();
    toast.success("All messages marked read");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    navigate("/admin/login");
  };

  // derived: filtered + searched + paginated
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let arr = messages;
    if (filter === "unread") arr = arr.filter(m => !m.read);
    if (filter === "read") arr = arr.filter(m => m.read);
    if (q) {
      arr = arr.filter(m =>
        (m.name || "").toLowerCase().includes(q) ||
        (m.email || "").toLowerCase().includes(q) ||
        (m.message || "").toLowerCase().includes(q)
      );
    }
    return arr;
  }, [messages, query, filter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="flex min-h-screen bg-[#01020a] text-white">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -260 }}
        animate={{ x: openSidebar ? 0 : -260 }}
        transition={{ duration: 0.35 }}
        className="fixed z-20 top-0 left-0 h-full w-64 bg-black/30 backdrop-blur-lg border-r border-white/5 p-6"
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-violet-600 shadow-lg flex items-center justify-center text-black font-bold">K</div>
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-cyan-300">Admin Panel</h2>
            <p className="text-xs text-white/60">Cyber Neon Dashboard</p>
          </div>
        </div>

        <nav className="space-y-3">
          <button className="w-full flex items-center gap-3 py-3 px-4 rounded-lg bg-gradient-to-r from-slate-900/40 to-transparent hover:from-slate-800/50">
            <Inbox className="text-cyan-300" /> <span className="text-white/90">Messages</span>
          </button>

          <button onClick={fullRefresh} className="w-full flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-white/5">
            <RefreshCcw /> <span>Refresh</span>
          </button>

          <div className="mt-6">
            <button onClick={handleLogout} className="w-full flex items-center gap-3 py-2 px-4 rounded-lg bg-red-600/90 hover:bg-red-500">
              <LogOut /> Logout
            </button>
          </div>
        </nav>
      </motion.aside>

      {/* Main */}
      <div className="flex-1 ml-0 md:ml-64 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button className="md:hidden bg-white/5 p-2 rounded" onClick={() => setOpenSidebar(v => !v)}>
              <Menu />
            </button>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-200 via-purple-400 to-pink-400">Dashboard</h1>
            <div className="ml-4 flex items-center gap-3 text-sm text-white/70 px-3 py-1 rounded-full bg-white/5">
              <BarChart2 /> Analytics
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                value={query}
                onChange={e => { setQuery(e.target.value); setPage(1); }}
                placeholder="Search name, email, message..."
                className="bg-white/3 placeholder-white/50 text-white px-3 py-2 rounded-lg pl-10 w-72 outline-none focus:ring-2 focus:ring-cyan-400"
              />
              <Search className="absolute left-3 top-2.5 text-white/60" />
            </div>

            <div className="flex items-center gap-2 bg-white/3 px-2 py-1 rounded-lg">
              <select value={filter} onChange={e => { setFilter(e.target.value); setPage(1); }} className="bg-transparent outline-none text-white/90 p-1">
                <option value="all">All</option>
                <option value="unread">Unread</option>
                <option value="read">Read</option>
              </select>
            </div>

            <button onClick={markAllRead} className="bg-cyan-500/90 px-3 py-2 rounded-lg hover:bg-cyan-400">Mark all read</button>

            <button
              onClick={async () => {
                try {
                  const res = await axios.get(`${API}/export?format=csv`, {
                    responseType: "blob",
                  });
                  const blob = new Blob([res.data], { type: "text/csv;charset=utf-8;" });
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `contacts_${Date.now()}.csv`;
                  document.body.appendChild(a);
                  a.click();
                  a.remove();
                  window.URL.revokeObjectURL(url);
                  toast.success("CSV downloaded");
                } catch (err) {
                  handleAuthError(err);
                  toast.error("Export failed");
                }
              }}
              className="bg-white/5 px-3 py-2 rounded-lg hover:bg-white/8"
            >
              Export CSV
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          {[
            { label: "Total Messages", value: stats.total, accent: "from-cyan-400 to-violet-500" },
            { label: "Today's Messages", value: stats.today, accent: "from-pink-500 to-orange-400" },
            { label: "Unread Messages", value: stats.unread, accent: "from-yellow-400 to-amber-600" },
          ].map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`bg-[#071024] p-5 rounded-xl shadow-xl border border-white/5`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm text-white/60">{card.label}</h3>
                  <p className="text-3xl font-extrabold">{card.value}</p>
                </div>
                <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${card.accent} flex items-center justify-center shadow-lg`}>
                  <BarChart2 className="text-black" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Chart */}
        <div className="bg-[#071024] p-6 rounded-xl shadow-lg mb-8">
          <h2 className="text-xl mb-4 font-semibold">Messages Per Day</h2>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4fd1c5" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#7c3aed" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#071824" />
              <XAxis dataKey="_id" stroke="#9aa4b2" />
              <YAxis stroke="#9aa4b2" />
              <Tooltip />
              <Area type="monotone" dataKey="count" stroke="#4fd1c5" fill="url(#grad1)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Messages list - Hybrid: table on desktop, cards on mobile */}
        <div className="bg-[#071024] p-4 rounded-xl shadow-lg">
          {/* Desktop Table */}
          <div className="hidden md:block">
            <table className="min-w-full">
              <thead className="bg-black/20 sticky top-0">
                <tr>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Message</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  [...Array(perPage)].map((_, i) => (
                    <tr key={i} className="border-b border-white/5">
                      <td colSpan={5} className="p-4">
                        <MessageSkeleton />
                      </td>
                    </tr>
                  ))
                ) : paginated.length > 0 ? (
                  paginated.map(m => (
                    <motion.tr key={m._id} className="border-b border-white/5" whileHover={{ scale: 1.01 }}>
                      <td className="p-3">{m.name}</td>
                      <td className="p-3">{m.email}</td>
                      <td className="p-3">
                        <div className="line-clamp-2 text-sm text-white/80">{m.message}</div>
                      </td>
                      <td className="p-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${m.read ? "bg-green-900 text-green-300" : "bg-yellow-900 text-yellow-300 animate-pulse"}`}>
                          {m.read ? "Read" : "Unread"}
                        </span>
                      </td>
                      <td className="p-3 flex gap-2">
                        <button onClick={() => { setSelected(m); if(!m.read) markRead(m._id); }} className="bg-white/5 px-3 py-1 rounded hover:bg-white/10">
                          <Eye /> View
                        </button>
                        {!m.read && <button onClick={() => markRead(m._id)} className="bg-cyan-600 px-3 py-1 rounded">Mark Read</button>}
                        <button onClick={() => deleteMessage(m._id)} className="bg-red-600 px-3 py-1 rounded"><Trash2 /></button>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr><td colSpan={5} className="p-4 text-center text-white/60">No messages found.</td></tr>
                )}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-white/60">Showing {paginated.length} of {filtered.length}</div>
              <div className="flex items-center gap-2">
                <button onClick={() => setPage(p => Math.max(1, p-1))} className="px-3 py-1 bg-white/5 rounded">Prev</button>
                <div className="px-3 py-1 bg-white/3 rounded">Page {page} / {totalPages}</div>
                <button onClick={() => setPage(p => Math.min(totalPages, p+1))} className="px-3 py-1 bg-white/5 rounded">Next</button>
              </div>
            </div>
          </div>

          {/* Mobile Cards (hybrid) */}
          <div className="md:hidden space-y-4">
            {loading ? (
              [...Array(4)].map((_, i) => <MessageSkeleton key={i} />)
            ) : filtered.length > 0 ? (
              filtered.map(m => (
                <MessageCard
                  key={m._id}
                  message={m}
                  onOpen={() => { setSelected(m); if (!m.read) markRead(m._id); }}
                  onDelete={() => deleteMessage(m._id)}
                />
              ))
            ) : (
              <div className="p-6 text-center text-white/60">No messages found.</div>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selected && (
          <MessageModal
            message={selected}
            onClose={() => setSelected(null)}
            onDelete={() => { deleteMessage(selected._id); setSelected(null); }}
            onMarkRead={() => { markRead(selected._id); setSelected(null); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}