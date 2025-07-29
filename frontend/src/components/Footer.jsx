// components/Footer.jsx
const Footer = () => {
  return (
    <footer className="bg-[#0d1117] dark:bg-[#0d1117] text-gray-400 text-sm py-6 text-center border-t border-gray-700">
      <p>
        © {new Date().getFullYear()}{" "}
        <span className="text-blue-500 font-semibold">Krushna Pokharkar</span>.
        All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
