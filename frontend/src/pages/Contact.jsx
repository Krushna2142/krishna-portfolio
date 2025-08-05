// src/pages/Contact.jsx

import { FaPhoneAlt, FaEnvelope, FaGithub, FaLinkedin } from 'react-icons/fa';

const Contact = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-800 dark:text-white flex items-center justify-center px-4">
      <div className="max-w-3xl w-full text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Get in Touch</h1>
        <p className="text-lg md:text-xl mb-10 text-gray-600 dark:text-gray-300">
          I’m always open to collaboration, opportunities, or just a good tech conversation. Reach out to me through any of the platforms below!
        </p>

        <div className="space-y-6 text-lg">
          <div className="flex items-center justify-center gap-3">
            <FaPhoneAlt className="text-blue-600 dark:text-blue-400" />
            <span>+91 98765 43210</span>
          </div>

          <div className="flex items-center justify-center gap-3">
            <FaEnvelope className="text-red-600 dark:text-red-400" />
            <span>krushna@email.com</span>
          </div>

          <div className="flex items-center justify-center gap-3">
            <FaGithub className="text-black dark:text-white" />
            <a
              href="https://github.com/krushnapokharkar"
              className="hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              github.com/krushnapokharkar
            </a>
          </div>

          <div className="flex items-center justify-center gap-3">
            <FaLinkedin className="text-blue-700 dark:text-blue-400" />
            <a
              href="https://linkedin.com/in/krushnapokharkar"
              className="hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              linkedin.com/in/krushnapokharkar
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
