import mongoose from "mongoose";

const optionValueSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: true,
      trim: true,
    },
    priceModifier: {
      type: Number,
      default: 0,
    },
  },
  { _id: false },
);

const optionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    required: {
      type: Boolean,
      default: false,
    },
    values: {
      type: [optionValueSchema],
      default: [],
    },
  },
  { _id: false },
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    basePrice: {
      type: Number,
      required: true,
      min: 0,
    },
    pointsValue: {
      type: Number,
      default: 0,
      min: 0,
    },
    options: {
      type: [optionSchema],
      default: [],
    },
    image: {
      type: String,
      default: "",
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    isActive: {
      type: Boolean,
      default: true,
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

export default mongoose.models.Product ||
  mongoose.model("Product", productSchema);
