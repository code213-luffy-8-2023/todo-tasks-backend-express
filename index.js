import express from "express";
import { connectDB } from "./models/db.js";
import { UserModel } from "./models/users.model.js";
import { SessionModel } from "./models/sessions.model.js";
import crypto from "crypto";
import { TaskModel } from "./models/tasks.model.js";
import cors from "cors";
connectDB()
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((e) => {
    console.error(e.message);
  });

const app = express();

app.use(express.json());

app.use(cors());

// TODO: Move routes to separate files

app.post("/api/users", async (req, res, next) => {
  try {
    const userData = req.body;

    if (!userData.email) {
      return res.status(400).json({
        message: "email is required",
      });
    }
    if (!userData.password) {
      return res.status(400).json({
        message: "password is required",
      });
    }

    const user = new UserModel(userData);

    const createdUser = await user.save();

    // create session
    const session = new SessionModel({
      userId: createdUser._id,
      token: crypto.randomUUID(),
      exp: new Date(Date.now() + 1000 * 60 * 60),
    });

    await session.save();

    res.status(201).json({
      message: "user created succesfully",
      user: createdUser,
      session: session,
    });
  } catch (e) {
    console.error(e.message);
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

app.post("/api/login", async (req, res, next) => {
  const loginData = req.body;

  if (!loginData.email) {
    return res.status(400).json({
      message: "email is required",
    });
  }

  if (!loginData.password) {
    return res.status(400).json({
      message: "password is required",
    });
  }

  const user = await UserModel.findOne({
    email: loginData.email,
    password: loginData.password,
  });

  if (!user) {
    return res.status(400).json({
      message: "Invalid email or password",
    });
  }

  // create session
  const session = new SessionModel({
    userId: user._id,
    token: crypto.randomUUID(),
    exp: new Date(Date.now() + 1000 * 60 * 60),
  });

  await session.save();

  res.status(200).json({
    message: "login successfull",
    user: user,
    session: session,
  });
});

app.post("/api/tasks", async (req, res, next) => {
  const sessionToken = req.headers["session-token"];

  if (!sessionToken) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  const session = await SessionModel.findOne({
    token: sessionToken,
    exp: {
      $gt: new Date(),
    },
  });

  if (!session) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  const taskDat = req.body;

  if (!taskDat.title) {
    return res.status(400).json({
      message: "title is required",
    });
  }

  const task = new TaskModel({
    userId: session.userId,
    title: taskDat.title,
    deadline: taskDat.deadline,
    isComplete: taskDat.isComplete,
  });

  await task.save();

  res.status(201).json({
    message: "task created successfully",
    task,
  });
});

app.get("/api/tasks", async (req, res, next) => {
  const sessionToken = req.headers["session-token"];

  if (!sessionToken) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  const session = await SessionModel.findOne({
    token: sessionToken,
    exp: {
      $gt: new Date(),
    },
  });

  if (!session) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  const tasks = await TaskModel.find({
    userId: session.userId,
  });

  return res.status(200).json({
    message: "success",
    tasks,
  });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
