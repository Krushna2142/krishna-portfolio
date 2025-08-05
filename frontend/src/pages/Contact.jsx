// src/pages/Contact.jsx
import { useState } from 'react';
import { toast } from 'react-toastify';
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';
import axios from 'axios';
const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, message } = formData;

    if (!name || !email || !message) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/messages`,
        formData
      );

      if (res.data.success) {
        toast.success("Message sent successfully!");
        setFormData({ name: "", email: "", message: "" });
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  return (
    <section className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-6">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-10">
        
        {/* Contact Info */}
        <div className="space-y-6">
          <h2 className="text-4xl font-bold text-white">Get in Touch</h2>
          <p className="text-gray-400">
            Feel free to contact me using the form or through the following platforms:
          </p>
          <div className="flex items-center gap-4 text-2xl">
            <a href="https://github.com/YOUR_USERNAME" target="_blank" rel="noreferrer">
              <FaGithub className="hover:text-blue-400 transition" />
            </a>
            <a href="https://linkedin.com/in/YOUR_USERNAME" target="_blank" rel="noreferrer">
              <FaLinkedin className="hover:text-blue-400 transition" />
            </a>
            <a href="mailto:your@email.com">
              <FaEnvelope className="hover:text-blue-400 transition" />
            </a>
          </div>
        </div>

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            name="name"
            required
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500"
          />
          <input
            type="email"
            name="email"
            required
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500"
          />
          <textarea
            name="message"
            rows="6"
            required
            placeholder="Your Message"
            value={formData.message}
            onChange={handleChange}
            className="w-full p-3 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500"
          ></textarea>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded text-white font-semibold"
          >
            {loading ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Contact;
