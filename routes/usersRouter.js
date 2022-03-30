require("dotenv").config
const express = require("express");
const prices = require("../models/services");
const router = express.Router();
const Users = require("../models/users");
const Prices = require("../models/services");
const {authenticateToken, authTokenAndAdmin, authTokenAndAuthorization} = require("../middleware/auth");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { getUser } = require("../middleware/get");

// GETTING ALL USERS
router.get("/", authenticateToken,  async (req, res, next) => {
  try {
    const users = await Users.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GETTING ONE USER
router.get("/:id",[getUser, authenticateToken],async (req, res, next) => {
  try {
    const user = await Users.findById(req.user._id);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});;

// CREATE ONE/REGISTER
router.post("/", async (req, res, next) => {
  const { user_name, user_email, user_contactNumber, user_password, } = req.body;
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
router.put("/:id", getUser, async (req, res, next) => {
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
router.delete("/:id", [ getUser], async (req, res, next) => {
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
  const user = await Users.findOne({ user_email });
  if (!user) res.status(404).json({ message: "Could not find user" });
  if (await bcrypt.compare(user_password, user.user_password)) {
    try {
      const access_token = jwt.sign(
        JSON.stringify(user),
        process.env.ACCESS_TOKEN_SECRET
      );
      res.status(201).json({ jwt: access_token, user })
      ;
      
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


module.exports = router;