import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    link: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
    },
  },
  { timestamps: { createdAt: "createdAt" } }
);

export default mongoose.model("Report", reportSchema);
