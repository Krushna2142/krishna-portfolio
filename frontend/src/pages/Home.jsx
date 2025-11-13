// src/pages/Home.jsx
import React, { useEffect } from "react";
import {
  FaArrowRight,
  FaGithub,
  FaLinkedin,
  FaInstagram,
} from "react-icons/fa";
import { TypeAnimation } from "react-type-animation";
import AOS from "aos";
import "aos/dist/aos.css";
import { Link } from "react-router-dom"; // ✅ Import Link

const Home = () => {
  useEffect(() => {
    AOS.init({ duration: 1200 });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center py-6 px-6 md:px-12 bg-white dark:bg-gray-900 transition duration-300">
      <div
        className="max-w-4xl text-center"
        data-aos="fade-up"
        data-aos-delay="200"
      >
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
          Hey, I'm{" "}
          <span className="text-blue-600 dark:text-blue-400">Krushna</span> 👋
        </h1>

        <TypeAnimation
          sequence={[
            "Full Stack Developer 💻", 2000,
            "Freelancer 🧑‍💼", 2000,
            "Cloud Enthusiast ☁️", 2000,
            "Tech Blogger 📝", 2000,
            "Open Source Contributor 🌍", 2000,
            "AI Enthusiast 🤖", 2000,
            
          ]}
          wrapper="span"
          speed={40}
          repeat={Infinity}
          className="block text-xl md:text-3xl font-medium text-gray-700 dark:text-gray-300 mb-8"
        />

        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
          I design and build modern and Scalable full stack web applications. Let's
          collaborate on something amazing.
        </p>

        {/* Social Icons */}
        <div className="flex justify-center gap-6 mb-8 text-2xl">
          <a
            href="https://github.com/Krushna2142"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
          >
            <FaGithub />
          </a>
          <a
            href="https://www.linkedin.com/in/krushna-pokharkar/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
          >
            <FaLinkedin />
          </a>
          <a
            href="https://www.instagram.com/krishna_pokharkar.243/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-700 dark:text-gray-300 hover:text-pink-500 transition"
          >
            <FaInstagram />
          </a>
        </div>  

        {/* Contact Button */}
        <Link
          to="/contact"   // ✅ Use Link instead of <a>
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition duration-300"
        >
          Contact Me
          <FaArrowRight />
        </Link>
      </div>
    </div>
  );
};

export default Home;
