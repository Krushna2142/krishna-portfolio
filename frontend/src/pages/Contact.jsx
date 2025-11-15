import React, { useState } from "react";
import axios from "axios";

const Contact = () => {
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
    setStatus("Sending...");

    try {
      const res = await axios.post(
        "https://krishna-portfolio-backend-ined.onrender.com/api/contact",
        formData
      );

      if (res.data.success) {
        setStatus("✅ Message sent successfully!");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setStatus("❌ Failed to send message.");
      }
    } catch (error) {
      console.error(error);
      setStatus("❌ Server error. Try again later.");
    }
  };

  return (
    <section className="min-h-screen bg-gray-900 text-white flex items-center justify-center px-6 py-18">
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-2xl shadow-2xl">
        <h2 className="text-3xl font-bold text-center mb-6 text-blue-400">
          Contact Me
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Name */}
          <div>
            <label className="block mb-2">Name</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-3 bg-gray-700 rounded"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-2">Email</label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-3 bg-gray-700 rounded"
            />
          </div>

          {/* Subject */}
          <div>
            <label className="block mb-2">Subject</label>
            <input
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              className="w-full p-3 bg-gray-700 rounded"
            />
          </div>

          {/* Message */}
          <div>
            <label className="block mb-2">Message</label>
            <textarea
              name="message"
              rows="4"
              value={formData.message}
              onChange={handleChange}
              required
              className="w-full p-3 bg-gray-700 rounded"
            ></textarea>
          </div>

          <button
            className="w-full py-3 bg-blue-500 rounded hover:bg-blue-600"
          >
            Send Message
          </button>
        </form>

        {status && <p className="text-center mt-4">{status}</p>}
      </div>
    </section>
  );
};

export default Contact;
