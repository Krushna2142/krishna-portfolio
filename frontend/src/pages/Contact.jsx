import React from "react";

const Contact = () => {
  return (
    <div className="w-full min-h-screen dark:bg-gray-900 bg-gray-50 flex flex-col items-center py-12 px-4">
      {/* Heading */}
      <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white pt-6 mb-4 tracking-wide">
        Contact Us
      </h1>
      <p className="text-lg text-gray-700 dark:text-gray-300 mb-10 max-w-2xl text-center leading-relaxed">
        Have a question, feedback, or project inquiry?  
        Fill out the form below and we’ll get back to you as soon as possible.
      </p>

      {/* Google Form Embed */}
      <div className="w-full max-w-4xl bg-white dark:bg-gray-800 shadow-2xl rounded-2xl overflow-hidden p-4 border border-gray-200 dark:border-gray-700">
        <iframe
          src="https://docs.google.com/forms/d/e/1FAIpQLSfyaE5LUB9pDDifdz5XuWaVsC3wcHOOiau5qAp1p0-GOAh3vA/viewform?embedded=true"
           className="w-full h-[1200px] border-0"
      title="Contact Form"
        >
          Loading…
        </iframe>
      </div>

      {/* Decorative line */}
      <div className="mt-12 w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
    </div>
  );
};

export default Contact;
