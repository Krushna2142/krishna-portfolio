/* eslint-disable no-unused-vars */
// src/components/ContactForm.jsx
import { useState } from "react";
import axios from "axios";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/contact", formData);
      setStatus("Message sent successfully!");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setStatus("Failed to send message. Try again.");
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-gray-900 text-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl mb-4">Contact Me</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          className="p-2 rounded bg-gray-800"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          className="p-2 rounded bg-gray-800"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="subject"
          placeholder="Subject"
          className="p-2 rounded bg-gray-800"
          value={formData.subject}
          onChange={handleChange}
          required
        />
        <textarea
          name="message"
          placeholder="Message"
          className="p-2 rounded bg-gray-800"
          rows="5"
          value={formData.message}
          onChange={handleChange}
          required
        />
        <button
          type="submit"
          className="bg-blue-600 p-2 rounded hover:bg-blue-500"
        >
          Send Message
        </button>
      </form>
      {status && <p className="mt-2">{status}</p>}
    </div>
  );
}
