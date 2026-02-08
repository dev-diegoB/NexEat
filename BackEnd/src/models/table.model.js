import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      trim: true,
    },
    claimedAt: {
      type: Date,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    lastActivityAt: {
      type: Date,
      required: true,
    },
  },
  { _id: false },
);

const tableSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    status: {
      type: String,
      enum: ["free", "waiting_payment", "occupied", "disabled"],
      default: "free",
    },

    currentSession: {
      type: sessionSchema,
      default: null,
    },

    lastOrderAt: {
      type: Date,
      default: null,
    },

    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.Table || mongoose.model("Table", tableSchema);
