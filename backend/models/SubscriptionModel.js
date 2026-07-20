import mongoose, { Schema } from "mongoose";

const SubscriptionSchema = new Schema(
  {
    subscriptionId: {
      type: String,
      required: true,
      unique: true,
    },
    orderId: {
      type: String, // Store orderId for prorated upgrades
    },
    razorpayPaymentId: {
      type: String, // Store razorpayPaymentId when paid
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      default: "created", // e.g. created, authenticated, active, charged, cancelled, paid
    },
    planId: {
      type: String,
    },
    planName: {
      type: String,
      enum: ["Basic", "Pro", "Enterprise"],
    },
    type: {
      type: String,
      enum: ["new", "upgrade"],
      default: "new",
    },
  },
  {
    timestamps: true,
  }
);

const Subscription = mongoose.model("Subscription", SubscriptionSchema);

export default Subscription;
