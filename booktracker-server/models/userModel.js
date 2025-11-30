import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true },
    userEmail: { type: String, required: true, unique: true },
    userPassword: { type: String, required: true }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

const userModel = mongoose.model("bookusers", userSchema);
export default userModel;
