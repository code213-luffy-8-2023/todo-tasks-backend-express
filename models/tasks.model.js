import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  isComplete: {
    type: Boolean,
    default: false,
  },
  userId: {
    ref: "User",
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  deadline: { type: Date },
});

taskSchema.methods.toJSON = function () {
  const task = this.toObject();
  delete task.__v;
  task.id = task._id;
  delete task._id;
  return task;
};

export const TaskModel = mongoose.model("Task", taskSchema);
