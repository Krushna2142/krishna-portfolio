import mongoose from "mongoose";

const admin = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },   // hashed
  role: { type: String, default: "admin" }
});

export default mongoose.model("Admin", admin);
  