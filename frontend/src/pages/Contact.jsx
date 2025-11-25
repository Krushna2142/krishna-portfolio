/* eslint-disable no-unused-vars */
import { useState } from "react";
import axios from "axios";

export default function Contact() {
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
        "http://localhost:8080/api/contact",
        formData
      );

      if (res.data === "OK") {
        setStatus("Message Sent Successfully ✔️");
      } else {
        setStatus("❌ Failed: " + res.data);
      }

    } catch (err) {
      setStatus("❌ Error sending message");
    }
  };

  return (
    <div className="text-white p-8 bg-black min-h-screen">
      <h2 className="text-3xl font-bold mb-6">Contact Me</h2>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">

        <input
          type="text"
          name="name"
          placeholder="Your Name"
          className="w-full p-3 bg-gray-800 border border-gray-700 rounded"
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          placeholder="Your Email"
          className="w-full p-3 bg-gray-800 border border-gray-700 rounded"
          onChange={handleChange}
        />

        <input
          type="text"
          name="subject"
          placeholder="Subject"
          className="w-full p-3 bg-gray-800 border border-gray-700 rounded"
          onChange={handleChange}
        />

        <textarea
          name="message"
          placeholder="Message"
          rows="5"
          className="w-full p-3 bg-gray-800 border border-gray-700 rounded"
          onChange={handleChange}
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
