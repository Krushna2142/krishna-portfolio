/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { Mail, Trash2, Eye } from "lucide-react";

export default function MessageCard({ message, onOpen = () => {}, onDelete = () => {} }) {
  const { name, email, message: body, createdAt, read } = message;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="bg-[#011024] border border-white/3 p-4 rounded-xl"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${read ? "bg-green-400" : "bg-pink-400 animate-pulse"}`}></div>
            <h3 className="font-semibold">{name}</h3>
            <span className="text-xs text-white/50 ml-2">{new Date(createdAt).toLocaleString()}</span>
          </div>
          <div className="text-sm text-white/80 mt-2 line-clamp-3">{body}</div>
          <div className="text-xs text-white/40 mt-2">{email}</div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <button onClick={onOpen} className="p-2 bg-white/5 rounded hover:bg-white/10"><Eye size={16}/></button>
          <button onClick={onDelete} className="p-2 bg-red-600 rounded hover:bg-red-500"><Trash2 size={16}/></button>
        </div>
      </div>
    </motion.div>
  );
}
