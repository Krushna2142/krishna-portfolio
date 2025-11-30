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
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(""); // clear previous status

    try {
      const res = await axios.post(
        "https://krishna-portfolio-backend-ined.onrender.com/api/contact",
        formData
      );

      if (res.data.success) {
        setStatus("✅ Message sent successfully!");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setStatus("❌ Failed to send message. Try again.");
      }
    } catch (err) {
      console.error("Contact form error:", err.response || err);
      setStatus(
        err.response?.data?.message ||
          "❌ Failed to send message. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-gray-900 text-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl mb-4">Contact Me</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Your Name"
          className="p-2 rounded bg-gray-800"
          required
        />
        <input
          name="email"
          value={formData.email}
          onChange={handleChange}
          type="email"
          placeholder="Your Email"
          className="p-2 rounded bg-gray-800"
          required
        />
        <input
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          placeholder="Subject (optional)"
          className="p-2 rounded bg-gray-800"
        />
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Message"
          rows="5"
          className="p-2 rounded bg-gray-800"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className={`p-2 rounded ${
            loading ? "bg-gray-600 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-500"
          }`}
        >
          {loading ? "Sending..." : "Send Message"}
        </button>
      </form>
      {status && <p className="mt-2">{status}</p>}
    </div>
  );
}
