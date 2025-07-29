import React from "react";

const ProjectCard = ({ title, description, image, github, live }) => {
  return (
    <div className="bg-[#1a1a1a] rounded-xl shadow-md hover:shadow-indigo-500/50 p-5 transition-all duration-300 hover:-translate-y-1">
      <img
        src={image}
        alt={title}
        className="w-full h-48 object-cover rounded-lg mb-4"
      />
      <h3 className="text-xl font-semibold text-indigo-400 mb-2">{title}</h3>
      <p className="text-gray-300 mb-4">{description}</p>
      <div className="flex justify-between">
        <a
          href={github}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-indigo-600 transition"
        >
          GitHub
        </a>
        <a
          href={live}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-500 transition"
        >
          Live Demo
        </a>
      </div>
    </div>
  );
};

export default ProjectCard;
