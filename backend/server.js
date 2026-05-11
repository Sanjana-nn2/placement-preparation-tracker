const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Topic = require("./models/Topic");
const Problem = require("./models/Problem");
const Test = require("./models/Test");
const User = require("./models/User");
const Company = require("./models/Company");
const Note = require("./models/Note");
const Task = require("./models/Task");

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect("mongodb://127.0.0.1:27017/placementDB")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

/* ---------------- AUTH ROUTES ---------------- */

app.post("/register", async (req, res) => {
  try {
    const name = req.body.name.trim();
    const email = req.body.email.trim().toLowerCase();
    const password = req.body.password;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const email = req.body.email.trim().toLowerCase();
    const password = req.body.password;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid email" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ id: user._id }, "secretkey", {
      expiresIn: "7d",
    });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

/* ---------------- TOPIC ROUTES ---------------- */

app.post("/add-topic", async (req, res) => {
  const newTopic = new Topic({
    name: req.body.name,
    userId: req.body.userId,
  });

  await newTopic.save();
  res.send("Topic saved");
});

app.get("/get-topics/:userId", async (req, res) => {
  const topics = await Topic.find({ userId: req.params.userId });
  res.json(topics);
});

app.put("/update-topic/:id", async (req, res) => {
  await Topic.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
  });

  res.send("Topic updated");
});

app.delete("/delete-topic/:id", async (req, res) => {
  await Topic.findByIdAndDelete(req.params.id);
  res.send("Topic deleted");
});

/* ---------------- PROBLEM ROUTES ---------------- */

app.post("/add-problem", async (req, res) => {
  const newProblem = new Problem({
    title: req.body.title,
    difficulty: req.body.difficulty,
    userId: req.body.userId,
  });

  await newProblem.save();
  res.send("Problem saved");
});

app.get("/get-problems/:userId", async (req, res) => {
  const problems = await Problem.find({ userId: req.params.userId });
  res.json(problems);
});

app.put("/update-problem/:id", async (req, res) => {
  await Problem.findByIdAndUpdate(req.params.id, {
    title: req.body.title,
    difficulty: req.body.difficulty,
  });

  res.send("Problem updated");
});

app.delete("/delete-problem/:id", async (req, res) => {
  await Problem.findByIdAndDelete(req.params.id);
  res.send("Problem deleted");
});

/* ---------------- TEST ROUTES ---------------- */

app.post("/add-test", async (req, res) => {
  const newTest = new Test({
    testName: req.body.testName,
    score: req.body.score,
    userId: req.body.userId,
  });

  await newTest.save();
  res.send("Test saved");
});

app.get("/get-tests/:userId", async (req, res) => {
  const tests = await Test.find({ userId: req.params.userId });
  res.json(tests);
});

app.put("/update-test/:id", async (req, res) => {
  await Test.findByIdAndUpdate(req.params.id, {
    testName: req.body.testName,
    score: req.body.score,
  });

  res.send("Test updated");
});

app.delete("/delete-test/:id", async (req, res) => {
  await Test.findByIdAndDelete(req.params.id);
  res.send("Test deleted");
});

/* ---------------- COMPANY ROUTES ---------------- */

app.post("/add-company", async (req, res) => {
  const newCompany = new Company({
    companyName: req.body.companyName,
    targetRole: req.body.targetRole,
    status: req.body.status,
    userId: req.body.userId,
  });

  await newCompany.save();
  res.send("Company saved");
});

app.get("/get-companies/:userId", async (req, res) => {
  const companies = await Company.find({ userId: req.params.userId });
  res.json(companies);
});

app.put("/update-company/:id", async (req, res) => {
  await Company.findByIdAndUpdate(req.params.id, {
    companyName: req.body.companyName,
    targetRole: req.body.targetRole,
    status: req.body.status,
  });

  res.send("Company updated");
});

app.delete("/delete-company/:id", async (req, res) => {
  await Company.findByIdAndDelete(req.params.id);
  res.send("Company deleted");
});

/* ---------------- NOTE ROUTES ---------------- */

app.post("/add-note", async (req, res) => {
  const newNote = new Note({
    title: req.body.title,
    category: req.body.category,
    content: req.body.content,
    userId: req.body.userId,
  });

  await newNote.save();
  res.send("Note saved");
});

app.get("/get-notes/:userId", async (req, res) => {
  const notes = await Note.find({ userId: req.params.userId });
  res.json(notes);
});

app.put("/update-note/:id", async (req, res) => {
  await Note.findByIdAndUpdate(req.params.id, {
    title: req.body.title,
    category: req.body.category,
    content: req.body.content,
  });

  res.send("Note updated");
});

app.delete("/delete-note/:id", async (req, res) => {
  await Note.findByIdAndDelete(req.params.id);
  res.send("Note deleted");
});

/* ---------------- TASK ROUTES ---------------- */

app.post("/add-task", async (req, res) => {
  const newTask = new Task({
    taskTitle: req.body.taskTitle,
    priority: req.body.priority,
    status: req.body.status,
    userId: req.body.userId,
  });

  await newTask.save();
  res.send("Task saved");
});

app.get("/get-tasks/:userId", async (req, res) => {
  const tasks = await Task.find({ userId: req.params.userId });
  res.json(tasks);
});

app.put("/update-task/:id", async (req, res) => {
  await Task.findByIdAndUpdate(req.params.id, {
    taskTitle: req.body.taskTitle,
    priority: req.body.priority,
    status: req.body.status,
  });

  res.send("Task updated");
});

app.delete("/delete-task/:id", async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.send("Task deleted");
});

/* ---------------- DEFAULT ROUTE ---------------- */

app.get("/", (req, res) => {
  res.send("Backend is running");
});

/* ---------------- START SERVER ---------------- */

app.listen(5000, () => {
  console.log("Server running on port 5000");
});