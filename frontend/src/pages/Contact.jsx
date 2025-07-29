import React, { useEffect, useState } from "react";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import AOS from "aos";
import "aos/dist/aos.css";
import "react-toastify/dist/ReactToastify.css";

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      return toast.error("Please fill in all fields.");
    }

    try {
      // send to your backend here if needed
      toast.success("Message sent successfully!");
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      toast.error("Something went wrong!",error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white px-6 py-12 flex flex-col items-center justify-center">
      <div className="max-w-4xl w-full" data-aos="fade-up">
        <h2 className="text-4xl font-bold text-center mb-8 text-blue-400">Get In Touch</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Info */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <FaPhoneAlt className="text-blue-400 text-xl" />
              <p className="text-lg">+91 7410796292</p>
            </div>
            <div className="flex items-center gap-4">
              <FaEnvelope className="text-blue-400 text-xl" />
              <p className="text-lg">krushnapokharkar183@gmail.com</p>
            </div>
            <div className="flex items-center gap-4">
              <FaMapMarkerAlt className="text-blue-400 text-xl" />
              <p className="text-lg">Pune, Maharashtra, India</p>
            </div>

            <div className="mt-6 flex gap-4">
              <a href="https://github.com/Krushna2142" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-white transition duration-300">GitHub</a>
              <a href="https://linkedin.com/in/krush" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-white transition duration-300">LinkedIn</a>
              <a href="https://discord.com/users/krushna" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-white transition duration-300">Discord</a>
              <a href="https://instagram.com/krushna" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-white transition duration-300">Instagram</a>
            </div>
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="bg-gray-800 rounded-2xl p-6 space-y-6 shadow-lg">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <textarea
              name="message"
              placeholder="Your Message"
              value={formData.message}
              onChange={handleChange}
              rows="5"
              className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            ></textarea>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
