import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Provider",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  dateTime: {
    type: Date,
    required: true,
  },
  type: {
    type: String,
    enum: ["Therapy", "Consult", "Follow-up", "Assessment"],
    default: "Consult",
  },
  mode: {
    type: String,
    enum: ["Video", "In-person", "Phone"],
    default: "Video",
  },
  status: {
    type: String,
    enum: ["scheduled", "completed", "cancelled"],
    default: "scheduled",
  },
  notes: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Appointment", appointmentSchema);
