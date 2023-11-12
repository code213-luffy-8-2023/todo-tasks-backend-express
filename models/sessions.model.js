import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  userId: {
    ref: "User",
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  exp: {
    type: Date,
    required: true,
  },
});

sessionSchema.methods.toJSON = function () {
  const sessionObj = this.toObject();
  delete sessionObj._id;
  delete sessionObj.__v;
  delete sessionObj.userId;

  return sessionObj;
};

export const SessionModel = mongoose.model("Session", sessionSchema);
