/* eslint-disable no-unused-vars */
// src/pages/admin/AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const [messages, setMessages] = useState([]);

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await axios.get('https://krishna-portfolio-1qbx.onrender.com/api/messages', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(res.data);
    } catch (error) {
      toast.error('Failed to fetch messages');
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`https://krishna-portfolio-1qbx.onrender.com/api/messages/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(messages.filter((msg) => msg._id !== id));
      toast.success('Message deleted');
    } catch (err) {
      toast.error('Error deleting message');
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h2 className="text-3xl font-bold mb-4">Admin Dashboard</h2>
      {messages.length === 0 ? (
        <p>No messages found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-800 rounded">
            <thead>
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Message</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((msg) => (
                <tr key={msg._id} className="border-t border-gray-700">
                  <td className="p-3">{msg.name}</td>
                  <td className="p-3">{msg.email}</td>
                  <td className="p-3">{msg.message}</td>
                  <td className="p-3">
                    <button
                      onClick={() => handleDelete(msg._id)}
                      className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
