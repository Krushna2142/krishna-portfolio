/* eslint-disable no-unused-vars */
import { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");

    try {
      const res = await fetch("http://localhost:8080/api/public/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),   // ✅ CORRECT
      });

      if (!res.ok) {
        throw new Error("Failed to send message");
      }

      setStatus("Message sent successfully!");
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      setStatus("Something went wrong. Try again.");
      console.error(err);
    }
  };

  return (
    <div className="text-white p-8 bg-black min-h-screen">
      <h2 className="text-3xl font-bold mb-6">Contact Me</h2>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <input
          type="text"
          name="name"
          value={formData.name}
          placeholder="Your Name"
          className="w-full p-3 bg-gray-800 border border-gray-700 rounded"
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          value={formData.email}
          placeholder="Your Email"
          className="w-full p-3 bg-gray-800 border border-gray-700 rounded"
          onChange={handleChange}
          required
        />

        <textarea
          name="message"
          value={formData.message}
          placeholder="Message"
          rows="5"
          className="w-full p-3 bg-gray-800 border border-gray-700 rounded"
          onChange={handleChange}
          required
        ></textarea>

        <button
          type="submit"
          className="w-full p-3 bg-blue-600 hover:bg-blue-700 rounded"
        >
          Send Message
        </button>
      </form>

      {status && <p className="mt-4 text-lg">{status}</p>}
    </div>
  );
}
