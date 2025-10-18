import mongoose from "mongoose";

const { Schema, model } = mongoose;

const PrivateUserSchema = new Schema({
  clientName: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  gallery: { type: Schema.Types.ObjectId, ref: "Gallery" },
});

const PrivateUser = model("PrivateUser", PrivateUserSchema);

export default PrivateUser;
