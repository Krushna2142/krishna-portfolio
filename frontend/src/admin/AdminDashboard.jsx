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
      <h1 className="text-3xl mb-4">Dashboard</h1>
      <div className="mb-4">
        <span>Total: {stats.total}</span>{" | "}
        <span>Today: {stats.today}</span>{" | "}
        <span>Unread: {stats.unread}</span>
      </div>
      <table className="w-full text-left border border-gray-700">
        <thead>
          <tr className="border-b border-gray-700">
            <th className="p-2">Name</th>
            <th>Email</th>
            <th>Message</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {messages.map((m) => (
            <tr key={m._id} className="border-b border-gray-700">
              <td className="p-2">{m.name}</td>
              <td className="p-2">{m.email}</td>
              <td className="p-2">{m.message}</td>
              <td className="p-2">{m.read ? "Read" : "Unread"}</td>
              <td className="p-2">
                {!m.read && (
                  <button
                    onClick={() => markRead(m._id)}
                    className="bg-green-600 p-1 rounded mr-2"
                  >
                    Mark Read
                  </button>
                )}
                <button
                  onClick={() => deleteMessage(m._id)}
                  className="bg-red-600 p-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
