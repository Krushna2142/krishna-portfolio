import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const About = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <section className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 pt-20 px-6 py-12 md:px-20">
      <h2 className="text-4xl font-bold mb-8 text-center" data-aos="fade-down">
        About Me
      </h2>

      <div className="max-w-4xl mx-auto space-y-6 text-lg leading-relaxed" data-aos="fade-up">
        <p>
          👋 I'm <strong>Krushna Pokharkar</strong>, a passionate Full Stack Developer dedicated to building scalable, performant, and modern web applications.
        </p>
        <p>
          💻 With hands-on experience in <strong>MERN Stack, Java, Python, MongoDB, and PostgreSQL</strong>, I create robust frontends and powerful backends.
        </p>
        <p>
          🚀 I focus on delivering real-world solutions that are both visually appealing and functionally strong.
        </p>
        <p>
          🎯 My goal is to contribute to impactful projects and become a part of innovative tech-driven teams.
        </p>
      </div>

      {/* Timeline or Experience Section */}
      <div className="mt-16" data-aos="fade-up">
        <h3 className="text-3xl font-semibold mb-6 text-center">Experience Timeline</h3>
        <div className="space-y-4 max-w-3xl mx-auto">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
            <h4 className="font-bold text-cyan-600">2024 - Present</h4>
            <p>Working on real-world projects including a Portfolio, Physio Website, and Intelligent Workflow Automation Platform.</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
            <h4 className="font-bold text-cyan-600">2023 - 2024</h4>
            <p>Completed multiple freelance projects, practiced full-stack dev, and contributed to open source.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
