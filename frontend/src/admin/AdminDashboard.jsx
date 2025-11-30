/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { LogOut, Inbox, BarChart2, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard({ token: tokenProp }) {
  const API = "https://krishna-portfolio-backend-ined.onrender.com/api/contact";
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [stats, setStats] = useState({ total: 0, today: 0, unread: 0 });
  const [chartData, setChartData] = useState([]);
  const [openSidebar, setOpenSidebar] = useState(false);

  useEffect(() => {
    const token = tokenProp || localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [tokenProp]);

  const handleAuthError = (err) => {
    if (err?.response?.status === 401) {
      localStorage.removeItem("token");
      navigate("/admin/login", { replace: true });
    } else {
      console.error("API error:", err);
    }
  };

  const unwrap = (res) => {
    const d = res?.data ?? null;
    if (d == null) return null;
    if (d.payload !== undefined) return d.payload;
    return d;
  };

  const fetchMessages = async () => {
    try {
      const res = await axios.get(`${API}/all`);
      const payload = unwrap(res) ?? [];
      setMessages(Array.isArray(payload) ? payload : []);
    } catch (err) {
      handleAuthError(err);
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
      setChartData(Array.isArray(payload) ? payload : []);
    } catch (err) {
      if (err?.response?.status === 404) {
        setChartData([]);
        return;
      }
      handleAuthError(err);
    }
  };

  useEffect(() => {
    fetchMessages();
    fetchStats();
    fetchChart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const markRead = async (id) => {
    try {
      await axios.put(`${API}/read/${id}`, {});
      await fetchMessages();
      await fetchStats();
    } catch (err) {
      handleAuthError(err);
    }
  };

  const deleteMessage = async (id) => {
    try {
      await axios.delete(`${API}/${id}`);
      await fetchMessages();
      await fetchStats();
      await fetchChart();
    } catch (err) {
      handleAuthError(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    navigate("/admin/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      <motion.aside
        initial={{ x: -200 }}
        animate={{ x: openSidebar ? 0 : -200 }}
        transition={{ duration: 0.4 }}
        className="fixed z-20 top-0 left-0 h-full w-64 bg-gray-800/70 backdrop-blur-lg shadow-xl p-6"
      >
        <h2 className="text-2xl font-bold mb-8">Admin Panel</h2>

        <nav className="space-y-4">
          <div className="flex items-center gap-3 text-lg p-3 bg-gray-700 rounded-lg">
            <Inbox size={20} />
            Messages
          </div>

          <div className="flex items-center gap-3 text-lg p-3 bg-gray-700 rounded-lg">
            <BarChart2 size={20} />
            Analytics
          </div>
        </nav>

        <button
          onClick={handleLogout}
          className="absolute bottom-6 left-6 flex items-center gap-2 bg-red-600 px-4 py-2 rounded-lg hover:bg-red-500"
        >
          <LogOut size={18} /> Logout
        </button>
      </motion.aside>

      <div className="flex-1 ml-0 md:ml-64 p-6">
        <div className="flex items-center justify-between mb-6">
          <button
            className="md:hidden bg-gray-700 p-2 rounded"
            onClick={() => setOpenSidebar(!openSidebar)}
          >
            <Menu size={24} />
          </button>

          <h1 className="text-3xl font-bold">Dashboard</h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          {[
            { label: "Total Messages", value: stats.total },
            { label: "Today's Messages", value: stats.today },
            { label: "Unread Messages", value: stats.unread },
          ].map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-gray-800 p-6 rounded-xl shadow-lg hover:scale-105 transition-transform"
            >
              <h2 className="text-xl text-gray-300">{card.label}</h2>
              <p className="text-4xl font-bold mt-2">{card.value}</p>
            </motion.div>
          ))}
        </div>

        <div className="bg-gray-800 p-6 rounded-xl shadow-lg mb-10">
          <h2 className="text-xl mb-4 font-semibold">Messages Per Day</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#4f8cff" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-gray-800 p-4 rounded-xl shadow-lg overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Message</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {messages.length > 0 ? (
                messages.map((m) => (
                  <tr key={m._id} className="border-b border-gray-700">
                    <td className="p-3">{m.name}</td>
                    <td className="p-3">{m.email}</td>
                    <td className="p-3">{m.message}</td>
                    <td
                      className={`p-3 font-semibold ${
                        m.read ? "text-green-400" : "text-yellow-400"
                      }`}
                    >
                      {m.read ? "Read" : "Unread"}
                    </td>

                    <td className="p-3 flex gap-3">
                      {!m.read && (
                        <button
                          onClick={() => markRead(m._id)}
                          className="bg-green-600 px-3 py-1 rounded hover:bg-green-500"
                        >
                          Mark Read
                        </button>
                      )}
                      <button
                        onClick={() => deleteMessage(m._id)}
                        className="bg-red-600 px-3 py-1 rounded hover:bg-red-500"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-3 text-center text-gray-400">
                    No messages found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}