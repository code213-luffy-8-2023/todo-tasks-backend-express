import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  gender: {
    type: String,
    enum: ["male", "female"],
  },
  birthDate: {
    type: Date,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 8,
    validate: {
      validator: function (v) {
        return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(
          v
        );
      },
    },
  },
});

userSchema.methods.toJSON = function () {
  const userObj = this.toObject();
  userObj.id = this._id;
  delete userObj.password;
  delete userObj._id;
  delete userObj.__v;

  return userObj;
};

export const UserModel = mongoose.model("User", userSchema);
