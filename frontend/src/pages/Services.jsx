import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const servicesData = [
  {
    category: 'Frontend Development',
    items: [
      'Responsive Web Design',
      'React.js & Next.js Apps',
      'Tailwind / Bootstrap UI',
      'Performance Optimization',
    ],
  },
  {
    category: 'Backend Development',
    items: [
      'RESTful APIs with Node.js',
      'MongoDB / PostgreSQL Integration',
      'Authentication & Authorization',
      'Real-time Apps (Socket.io)',
    ],
  },
  {
    category: 'DevOps & Deployment',
    items: [
      'CI/CD with GitHub Actions',
      'Docker & Containerization',
      'Deployment to Vercel / Render / Heroku',
      'Domain Setup & SSL',
    ],
  },
];

const Services = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
    document.title = 'Services | Krushna Pokharkar';
  }, []);

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-white px-4 md:px-20 py-16">
      <h2 className="text-4xl font-bold text-center mb-12">My Services</h2>

      <div className="grid md:grid-cols-3 gap-10">
        {servicesData.map((service, idx) => (
          <div
            key={idx}
            data-aos="fade-up"
            className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-6 shadow-md hover:shadow-xl transition"
          >
            <h3 className="text-xl font-semibold mb-4 text-cyan-600 dark:text-cyan-400">
              {service.category}
            </h3>
            <ul className="space-y-2">
              {service.items.map((item, index) => (
                <li key={index} className="text-gray-700 dark:text-gray-300">
                  • {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Why Choose Me Section */}
      <div className="mt-20 max-w-4xl mx-auto text-center" data-aos="fade-up">
        <h3 className="text-3xl font-bold mb-6">Why Choose Me?</h3>
        <div className="space-y-4 text-gray-700 dark:text-gray-300">
          <p>✅ 100% responsive and pixel-perfect designs.</p>
          <p>⚡ Fast delivery with clean, maintainable code.</p>
          <p>🎯 Committed to quality, scalability, and performance.</p>
          <p>🛠️ Real-world experience in building full-stack applications.</p>
        </div>
      </div>
    </main>
  );
};

export default Services;
