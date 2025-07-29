/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "framer-motion";
import projects from "../data/projects.json";
import ProjectCard from "../components/ProjectCard";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren:0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const Projects = () => {
  return (
    <section className="min-h-screen bg-[#0e0e0e] text-white pt-20 px-6 py-12">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold mb-12 text-center text-indigo-400">
          🚀 My Top Projects
        </h2>

        <motion.div
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {projects.map((project, i) => (
            <motion.div key={i} variants={itemVariants}>
              <ProjectCard {...project} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
