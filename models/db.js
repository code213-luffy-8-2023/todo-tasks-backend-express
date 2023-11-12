import mongoose from "mongoose";

export async function connectDB() {
  return mongoose.connect("mongodb://127.0.0.1:27017/todo-db");
}
