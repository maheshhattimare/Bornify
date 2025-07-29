// models/Birthday.js
import mongoose from "mongoose";

const birthdaySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    birthdate: {
      type: Date,
      required: true,
    },
    relation: {
      type: String,
      enum: ["Friend", "Family", "Colleague", "Relative", "Partner", "Other"],
      default: "Other",
    },
    note: {
      type: String,
      default: "",
      trim: true,
    },
    imageUrl: {
      type: String,
      default: null, // <-- if no image, defaults to null
    },
    cloudinaryId: {
      type: String, // <-- no `required: true`
    },
    notifyBeforeDays: {
      type: Number,
      default: 1,
      min: 0,
    },
  },
  { timestamps: true }
);

const BirthdayModel = mongoose.model("Birthday", birthdaySchema);
export default BirthdayModel;
