import mongoose from "mongoose";

const providerSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName:  { type: String, required: true, trim: true },
  email:     { type: String, required: true, lowercase: true, unique: true, trim: true },
  phone:     { type: String, required: true, trim: true },
  password:  { type: String, required: true },
  profession: { type: String, required: true },
  title: { type: String, required: true, trim: true },
  experience: { type: Number, default: 0 },
  bio:       { type: String, default: "" },
  profileImageUrl: { type: String, default: "" },
  status:    { type: String, enum: ["pending","approved","rejected"], default: "pending" },
  role:      { type: String, enum: ["provider","admin"], default: "provider" },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model("Provider", providerSchema);
