import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('https://krishna-portfolio-1qbx.onrender.com/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Something went wrong');

      toast.success('Message sent successfully!');
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white px-4 py-10 flex flex-col md:flex-row items-center justify-center">
      {/* Get in Touch Side */}
      <div className="md:w-1/2 mb-10 md:mb-0 md:pr-12 text-center md:text-left">
        <h2 className="text-4xl font-bold mb-6">Get in Touch</h2>
        <p className="text-gray-300 mb-6">
          Feel free to reach out for collaborations or just a friendly hello 👋
        </p>
        <div className="flex justify-center md:justify-start space-x-6 text-xl">
          <a
            href="https://github.com/Krushna2142"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-500"
          >
            <FaGithub />
          </a>
          <a
            href="https://linkedin.com/in/krushnapokharkar"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-400"
          >
            <FaLinkedin />
          </a>
          <a
            href="mailto:krushnapokharkar183@gmail.com"
            className="hover:text-red-400"
          >
            <FaEnvelope />
          </a>
        </div>
      </div>

      {/* Contact Form */}
      <form
        onSubmit={handleSubmit}
        className="md:w-1/2 bg-gray-800 rounded-lg p-8 shadow-lg w-full max-w-lg"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center">Contact Form</h2>

        <div className="mb-4">
          <label htmlFor="name" className="block mb-1 font-medium">Name</label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded bg-gray-700 text-white outline-none"
            placeholder="Enter your name"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded bg-gray-700 text-white outline-none"
            placeholder="Enter your email"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="message" className="block mb-1 font-medium">Message</label>
          <textarea
            name="message"
            required
            rows="5"
            value={formData.message}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded bg-gray-700 text-white outline-none resize-none"
            placeholder="Your message..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 transition rounded text-white font-semibold"
        >
          {loading ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </div>
  );
};

export default Contact;
