const supabase = require("../config/supabase");
const { sendMail } = require("../utils/email");

exports.create = async (req, res) => {
  const { name, email, subject, message } = req.body;

  const { data, error } = await supabase
    .from("contacts")
    .insert([{ name, email, subject, message }])
    .select()
    .single();

  if (error) return res.status(500).json({ message: "DB error" });

  await sendMail({
    to: process.env.ADMIN_EMAIL,
    subject: "New Contact Message",
    html: `<b>${name}</b><br/>${message}`
  });

  if (global.io) global.io.emit("message:created", data);

  res.json(data);
};

exports.list = async (req, res) => {
  const { data } = await supabase
    .from("contacts")
    .select("*")
    .order("created_at", { ascending: false });

  res.json(data);
};

exports.markRead = async (req, res) => {
  const { id } = req.params;

  const { data } = await supabase
    .from("contacts")
    .update({ read: true })
    .eq("id", id)
    .select()
    .single();

  if (global.io) global.io.emit("message:updated", data);
  res.json(data);
};

exports.remove = async (req, res) => {
  const { id } = req.params;
  await supabase.from("contacts").delete().eq("id", id);
  if (global.io) global.io.emit("message:deleted", { id });
  res.json({ success: true });
};
