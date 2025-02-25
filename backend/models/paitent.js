import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  accessId: {
    type: String,
    required: true,
    unique: true,
  },
  reports: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Report",
    },
  ],
},{ timestamps: { createdAt: 'createdAt' } });

export default mongoose.model("Patient", patientSchema);
