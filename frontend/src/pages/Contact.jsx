import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { MdEmail } from "react-icons/md";

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
  { name, email, message },
  {
    headers: {
      "Content-Type": "application/json",
    },
  }
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
    <div className="min-h-screen w-full flex items-center justify-center bg-white dark:bg-gray-900 px-4 py-16">
      <div className="w-full max-w-xl bg-gray-100 dark:bg-gray-800 rounded-xl p-8 shadow-xl">
        <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-6">
          Contact Me
        </h2>

        <div className="flex justify-center mb-4 text-blue-600 text-3xl">
          <MdEmail />
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            className="w-full p-3 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none border border-gray-300 dark:border-gray-600"
            value={formData.name}
            onChange={handleChange}
          />

          <input
            type="email"
            name="email"
            placeholder="Your Email"
            className="w-full p-3 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none border border-gray-300 dark:border-gray-600"
            value={formData.email}
            onChange={handleChange}
          />

          <textarea
            name="message"
            placeholder="Your Message"
            rows="5"
            className="w-full p-3 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none border border-gray-300 dark:border-gray-600"
            value={formData.message}
            onChange={handleChange}
          ></textarea>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold transition duration-300"
          >
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
