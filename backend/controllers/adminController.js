const supabase = require("../config/supabase");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  const { username, password } = req.body;

  const { data, error } = await supabase
    .from("admins")
    .select("*")
    .eq("username", username)
    .single();

  if (error || !data)
    return res.status(401).json({ message: "Invalid credentials" });

  const match = await bcrypt.compare(password, data.password_hash);
  if (!match)
    return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign(
    { id: data.id, username },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({ token });
};
