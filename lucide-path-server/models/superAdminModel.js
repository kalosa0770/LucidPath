import mongoose from "mongoose";

const superAdminSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName:  { type: String, required: true, trim: true },
  email:     { type: String, required: true, lowercase: true, unique: true, trim: true },
  phone:     { type: String, required: true, trim: true },
  password:  { type: String, required: true },
  title:     { type: String, required: true, trim: true },
  permissions: {
    canManageProviders: { type: Boolean, default: true },
    canManageUsers: { type: Boolean, default: true },
    canModerateForum: { type: Boolean, default: true },
  },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model("SuperAdmin", superAdminSchema);
