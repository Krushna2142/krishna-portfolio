/* eslint-disable no-unused-vars */
// src/pages/Contact.jsx
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { FaLinkedin, FaGithub, FaEnvelope } from 'react-icons/fa';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(
        'https://krishna-portfolio-1qbx.onrender.com/api/messages',
        formData,
        { headers: { 'Content-Type': 'application/json' } }
      );
      toast.success('Message sent successfully!');
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      toast.error('Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center px-4 py-16">
      <h1 className="text-4xl font-bold mb-6">Get in Touch</h1>

      <div className="w-full max-w-4xl bg-gray-800 p-8 rounded-lg shadow-lg grid md:grid-cols-2 gap-6">
        {/* Contact Info */}
        <div className="flex flex-col space-y-4">
          <p className="text-lg">
            Feel free to reach out via the form or connect with me on:
          </p>
          <div className="flex items-center space-x-4 text-xl">
            <a
              href="https://linkedin.com/in/krushnapokharkar"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400 transition"
            >
              <FaLinkedin />
            </a>
            <a
              href="https://github.com/Krushna2142"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-400 transition"
            >
              <FaGithub />
            </a>
            <a
              href="mailto:krushnapokharkar183@gmail.com"
              className="hover:text-red-400 transition"
            >
              <FaEnvelope />
            </a>
          </div>
        </div>

        {/* Contact Form */}
        <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
          <input
            name="name"
            type="text"
            required
            placeholder="Your Name"
            className="p-3 bg-gray-700 rounded"
            value={formData.name}
            onChange={handleChange}
          />
          <input
            name="email"
            type="email"
            required
            placeholder="Your Email"
            className="p-3 bg-gray-700 rounded"
            value={formData.email}
            onChange={handleChange}
          />
          <textarea
            name="message"
            required
            placeholder="Your Message"
            rows="5"
            className="p-3 bg-gray-700 rounded"
            value={formData.message}
            onChange={handleChange}
          ></textarea>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 transition p-3 rounded text-white font-semibold"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
