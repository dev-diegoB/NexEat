import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    googleId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    picture: {
      type: String,
      required: false,
      trim: true,
    },
    points: {
      type: Number,
      default: 0,
      min: 0,
    },
    role: {
      type: String,
      enum: ["admin", "client", "staff"],
      default: "client",
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.Users || mongoose.model("Users", userSchema);
