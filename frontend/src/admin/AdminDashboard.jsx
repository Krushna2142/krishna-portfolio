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

export default function AdminDashboard({ token }) {
  const API = "https://krishna-portfolio-backend-ined.onrender.com/api/contact";

  const [messages, setMessages] = useState([]);
  const [stats, setStats] = useState({ total: 0, today: 0, unread: 0 });
  const [chartData, setChartData] = useState([]);
  const [openSidebar, setOpenSidebar] = useState(false);

  // -------------------------------
  // Fetch Messages + Stats + Chart
  // -------------------------------
  const fetchMessages = async () => {
    const { data } = await axios.get(`${API}/all`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setMessages(data);
  };

  const fetchStats = async () => {
    const { data } = await axios.get(`${API}/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setStats(data);
  };

  const fetchChart = async () => {
    const { data } = await axios.get(`${API}/chart/daily`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setChartData(data);
  };

  useEffect(() => {
    fetchMessages();
    fetchStats();
    fetchChart();
  }, []);

  // -------------------------------
  // Actions
  // -------------------------------
  const markRead = async (id) => {
    await axios.put(
      `${API}/read/${id}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchMessages();
    fetchStats();
  };

  const deleteMessage = async (id) => {
    await axios.delete(`${API}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchMessages();
    fetchStats();
    fetchChart();
  };

  // -------------------------------
  // Logout
  // -------------------------------
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/admin/login";
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      {/* ────────── SIDEBAR ────────── */}
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

      {/* ────────── MAIN AREA ────────── */}
      <div className="flex-1 ml-0 md:ml-64 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            className="md:hidden bg-gray-700 p-2 rounded"
            onClick={() => setOpenSidebar(!openSidebar)}
          >
            <Menu size={24} />
          </button>

          <h1 className="text-3xl font-bold">Dashboard</h1>
        </div>

        {/* ────────── STATS CARDS ────────── */}
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

        {/* ────────── CHART ────────── */}
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

        {/* ────────── MESSAGES TABLE ────────── */}
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
              {messages.map((m) => (
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
              ))}

              {messages.length === 0 && (
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
