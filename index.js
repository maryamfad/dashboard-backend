const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const User = require("./models/User");
const bcrypt = require("bcrypt");

const app = express();
app.use(express.json());
app.use(cors());

require('dotenv').config();

mongoose.connect(
 `mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@cluster0.2bhah7x.mongodb.net/Dashboard`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

app.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    email,
    password: hashedPassword,
  });

  try {
    await user.save();
    res.status(201).send("User created");
  } catch (error) {
    console.log(error);
    res.status(400).send("Error creating user");
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).send("Invalid credentials");
  }

  res.send("Logged in successfully");
});

app.listen(3001, () => {
  console.log("Server running on port 3001");
});
