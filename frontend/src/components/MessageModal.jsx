/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { X, Trash2, Check, Mail } from "lucide-react";
import toast from "react-hot-toast";

export default function MessageModal({ message, onClose = () => {}, onDelete = () => {}, onMarkRead = () => {} }) {
  if (!message) return null;
  const { name, email, subject, message: body, createdAt, read } = message;

  const handleQuickReply = () => {
    // open mail client prepopulated
    const mailto = `mailto:${email}?subject=${encodeURIComponent("Re: " + (subject || "Thanks for contacting"))}`;
    window.open(mailto, "_blank");
    toast("Opening mail client...");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <motion.div initial={{ y: 20 }} animate={{ y: 0 }} exit={{ y: 20 }} className="relative z-50 w-full max-w-2xl bg-[#031124] border border-white/5 p-6 rounded-2xl shadow-2xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold">{name}</h2>
            <p className="text-sm text-white/60">{email} • <span className="text-xs">{new Date(createdAt).toLocaleString()}</span></p>
          </div>
          <div className="flex items-center gap-2">
            {!read && <button onClick={onMarkRead} className="bg-cyan-600 px-3 py-1 rounded">Mark Read</button>}
            <button onClick={handleQuickReply} className="bg-white/5 px-3 py-1 rounded">Quick Reply</button>
            <button onClick={onDelete} className="bg-red-600 px-3 py-1 rounded">Delete</button>
            <button onClick={onClose} className="p-2 rounded bg-white/5"><X /></button>
          </div>
        </div>

        <div className="mt-4">
          {subject && <h4 className="text-sm font-medium text-white/70 mb-2">{subject}</h4>}
          <div className="prose prose-invert max-w-none text-white/80">{body.split("\n").map((line, i) => <p key={i}>{line}</p>)}</div>
        </div>
      </motion.div>
    </motion.div>
  );
}
