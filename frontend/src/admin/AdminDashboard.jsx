// src/pages/AdminDashboard.jsx
import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminDashboard({ token }) {
  const [messages, setMessages] = useState([]);
  const [stats, setStats] = useState({ total: 0, today: 0, unread: 0 });

  const fetchMessages = async () => {
    const { data } = await axios.get("/api/messages", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setMessages(data);
  };

  const fetchStats = async () => {
    const { data } = await axios.get("/api/messages/stats", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setStats(data);
  };

  useEffect(() => {
    fetchMessages();
    fetchStats();
  }, []);

  const markRead = async (id) => {
    await axios.put(`/api/messages/read/${id}`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchMessages();
    fetchStats();
  };

  const deleteMessage = async (id) => {
    await axios.delete(`/api/messages/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchMessages();
    fetchStats();
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-4xl font-bold mb-6 text-center">Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800 p-6 rounded-lg shadow hover:scale-105 transition-transform">
          <h2 className="text-xl font-semibold">Total Messages</h2>
          <p className="text-3xl mt-2">{stats.total}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow hover:scale-105 transition-transform">
          <h2 className="text-xl font-semibold">Today's Messages</h2>
          <p className="text-3xl mt-2">{stats.today}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow hover:scale-105 transition-transform">
          <h2 className="text-xl font-semibold">Unread Messages</h2>
          <p className="text-3xl mt-2">{stats.unread}</p>
        </div>
      </div>

      {/* Messages Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden">
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
              <tr key={m._id} className="border-b border-gray-700 hover:bg-gray-700 transition-colors">
                <td className="p-3">{m.name}</td>
                <td className="p-3">{m.email}</td>
                <td className="p-3">{m.message}</td>
                <td className={`p-3 font-semibold ${m.read ? "text-green-400" : "text-yellow-400"}`}>
                  {m.read ? "Read" : "Unread"}
                </td>
                <td className="p-3 flex gap-2">
                  {!m.read && (
                    <button
                      onClick={() => markRead(m._id)}
                      className="bg-green-600 px-3 py-1 rounded hover:bg-green-500 transition-colors"
                    >
                      Mark Read
                    </button>
                  )}
                  <button
                    onClick={() => deleteMessage(m._id)}
                    className="bg-red-600 px-3 py-1 rounded hover:bg-red-500 transition-colors"
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
  );
}
