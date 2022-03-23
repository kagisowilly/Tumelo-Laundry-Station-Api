require("dotenv").config
const express = require("express");
const prices = require("../models/services");
const router = express.Router();
const Users = require("../models/users");
const Prices = require("../models/services");
const authenticateToken = require("./components/auth");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// GETTING ALL USERS
router.get("/", async (req, res, next) => {
  try {
    const users = await Users.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GETTING ONE USER
router.get("/:id", getUser, (req, res, next) => {
  res.send(res.user);
});

// CREATE ONE/REGISTER
router.post("/", async (req, res, next) => {
  const { user_name, user_email, user_contactNumber, user_password, } = req.body;
    console.log(user_name)
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(user_password, salt);
  const user = new Users({
    user_name,
    user_email,
    user_contactNumber,
    user_password: hashedPassword,
    
  });

  try {
    const newUser = await user.save();
    try {
      const access_token = jwt.sign(
        JSON.stringify(newUser),
        process.env.ACCESS_TOKEN_SECRET
      );
      res.status(201).json({ jwt: access_token });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// UPDATE ONE
router.put("/:id", authenticateToken, getUser, async (req, res, next) => {
  if (req.body.user_name != null) {
    res.user.user_name = req.body.user_name;
  }
  if (req.body.user_email != null) {
    res.user.user_email = req.body.user_email;
  }
  if (req.body.user_password) {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(user_password, salt);
    res.user.user_password = hashedPassword;
  }
  if (req.body.user_contactNumber != null) {
    res.user.user_contactNumber = req.body.user_contactNumber;
  }

  try {
    const updatedUser = await res.user.save();
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE ONE
router.delete("/:id", [authenticateToken, getUser], async (req, res, next) => {
  try {
    await res.user.remove();
    res.json({ message: "Deleted User" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// LOGIN USER WITH EMAIL AND PASSWORD
router.patch("/", async (req, res, next) => {
  const { user_email, user_password } = req.body;
  const users = await Users.findOne({ user_email });
  if (!users) res.status(404).json({ message: "Could not find user" });
  if (await bcrypt.compare(user_password, users.user_password)) {
    try {
      const access_token = jwt.sign(
        JSON.stringify(users),
        process.env.ACCESS_TOKEN_SECRET
      );
      res.status(201).json({ jwt: access_token });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  } else {
    res
      .status(400)
      .json({ message: "Email and password do not match" });
  }
});

// 

// FUNCTION TO GET USER ID
async function getUser(req, res, next) {
  let user;
  try {
    user = await Users.findById(req.params.id);
    if (user == null) {
      return res.status(404).json({ message: "Cannot Find user" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.user = user;
  next();
}

module.exports = router;