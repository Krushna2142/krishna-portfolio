/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { useState } from "react";

export default function Sidebar() {
  const [open, setOpen] = useState(true);

  return (
    <motion.div
      animate={{ width: open ? "240px" : "70px" }}
      className="h-screen bg-white dark:bg-gray-800 shadow-lg flex flex-col p-4"
    >
      <button
        onClick={() => setOpen(!open)}
        className="text-gray-600 dark:text-gray-300 mb-4"
      >
        {open ? "⬅" : "➡"}
      </button>

      <motion.div
        animate={{ opacity: open ? 1 : 0 }}
        className="flex-1"
      >
        <h2 className="text-2xl font-semibold dark:text-white mb-6">
          {open && "Admin Panel"}
        </h2>

        <ul className="space-y-3 dark:text-gray-300">
          <li>📩 Messages</li>
          <li>⚙ Settings</li>
        </ul>
      </motion.div>
    </motion.div>
  );
}
