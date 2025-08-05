/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';
import { utils, write } from 'xlsx';

const AdminDashboard = () => {
  const [messages, setMessages] = useState([]);
  const token = localStorage.getItem('token');

  const fetchMessages = async () => {
    const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/messages`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setMessages(res.data);
  };

  const deleteMessage = async id => {
    await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/messages/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchMessages();
  };

  const exportToExcel = () => {
    const ws = utils.json_to_sheet(messages);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, 'Messages');
    const excelBuffer = write(wb, { bookType: 'xlsx', type: 'array' });
    const file = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(file, 'messages.xlsx');
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Admin Messages</h1>
      <button onClick={exportToExcel} className="mb-4 bg-green-600 text-white px-4 py-2 rounded">Export</button>
      <div className="grid gap-4">
        {messages.map(msg => (
          <div key={msg._id} className="bg-white p-4 rounded shadow">
            <p><strong>Name:</strong> {msg.name}</p>
            <p><strong>Email:</strong> {msg.email}</p>
            <p><strong>Message:</strong> {msg.message}</p>
            <p className="text-sm text-gray-500">{new Date(msg.createdAt).toLocaleString()}</p>
            <button onClick={() => deleteMessage(msg._id)} className="mt-2 text-red-600 hover:underline">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
