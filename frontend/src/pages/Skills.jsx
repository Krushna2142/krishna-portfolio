// src/pages/Skills.jsx
import React, { useEffect } from "react";
import {
  FaReact,
  FaNodeJs,
  FaPython,
  FaJava,
  FaDatabase,
  FaAndroid,
  FaCloud,
  FaHtml5,
  FaCss3Alt,
  FaGitAlt,
} from "react-icons/fa";
import {
  SiMongodb,
  SiTailwindcss,
  SiJavascript,
  SiFlutter,
} from "react-icons/si";
import AOS from "aos";
import "aos/dist/aos.css";

const skills = [
  { name: "React", icon: <FaReact className="text-cyan-400" /> },
  { name: "Node.js", icon: <FaNodeJs className="text-green-600" /> },
  { name: "MongoDB", icon: <SiMongodb className="text-green-500" /> },
  { name: "JavaScript", icon: <SiJavascript className="text-yellow-400" /> },
  { name: "Tailwind CSS", icon: <SiTailwindcss className="text-sky-400" /> },
  { name: "Python", icon: <FaPython className="text-yellow-300" /> },
  { name: "Java", icon: <FaJava className="text-red-500" /> },
  { name: "Flutter", icon: <SiFlutter className="text-blue-500" /> },
  { name: "HTML5", icon: <FaHtml5 className="text-orange-500" /> },
  { name: "CSS3", icon: <FaCss3Alt className="text-blue-600" /> },
  { name: "Git", icon: <FaGitAlt className="text-orange-600" /> },
  { name: "Android Dev", icon: <FaAndroid className="text-green-500" /> },
  { name: "Cloud", icon: <FaCloud className="text-gray-300" /> },
  { name: "Databases", icon: <FaDatabase className="text-indigo-400" /> },
];

const Skills = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white py-10 pt-20 px-6 md:px-20">
      <h2
        className="text-4xl font-bold text-center mb-12 text-white"
        data-aos="fade-down"
      >
        My <span className="text-blue-500">Skills</span>
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
        {skills.map((skill, idx) => (
          <div
            key={idx}
            data-aos="zoom-in"
            data-aos-delay={idx * 80}
            className="bg-gray-800 rounded-2xl p-6 flex flex-col items-center shadow-lg hover:scale-105 transition-transform duration-300"
          >
            <div className="text-4xl mb-4">{skill.icon}</div>
            <p className="text-lg font-medium text-gray-200">{skill.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Skills;
