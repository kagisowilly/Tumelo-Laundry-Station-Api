const router = require("express").Router();
const Booking = require("../models/booking");
const { authenticateToken } = require("../middleware/auth");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const express = require("express");
const { getUser, getBooking } = require("../middleware/get");

// CREATE A BOOKING
router.get("/:id", [getBooking ], (req, res, next) => {
  res.send(res.booking);
});

// CREATE BOOKING
router.post("/",[authenticateToken] ,async (req, res, next) => {
  const { username, email, phone, service, amount, date, time} = req.body;

  let booking = new Booking({
        username,
        email,
        phone,
        service,
        amount,
        date,
        time,
        author: req.user._id,
      });

  try {
    const newBooking = await booking.save();
    res.status(201).json(newBooking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET ALL BOOKINGS

router.get("/", async (req, res) => {
  const username = req.query.user;
  try {
    let bookings;
    if (username) {
      bookings = await Booking.find({ username: username });
    } else {
      bookings = await Booking.find();
    }
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// DELETE Booking
router.delete("/:id", [ authenticateToken,getBooking], async (req, res, next) => {
  try {
    await res.booking.remove();
    res.json({ message: "Deleted Service" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;
