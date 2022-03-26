const router = require("express").Router();
const Booking = require("../models/booking");
const { authenticateToken } = require("./components/auth");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// CREATE A BOOKING
router.get("/:id", [getBooking, authenticateToken ], (req, res, next) => {
  res.send(res.booking);
});

// CREATE SERVICE
router.post("/", authenticateToken, async (req, res, next) => {
  const { username, email, phone, service, amount, date, time} = req.body;

  let booking;

  service
    ? (booking = new Booking({
        username,
        email,
        phone,
        service,
        amount,
        date,
        time,
        author: req.user._id,
      }))
    : (booking = new Booking({
        username,
        email,
        phone,
        service,
        amount,
        date,
        time,
        author: req.user._id,
      }));

  try {
    const newBooking = await booking.save();
    res.status(201).json(newBooking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET ALL BOOKINGS

router.get("/", authenticateToken, async (req, res) => {
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

// UPDATE SERVICE
// router.put("/:id", [authenticateToken, getBooking], async (req, res, next) => {
//   if (req.user._id !== res.booking.author)
//     res
//       .status(400)
//       .json({
//         message: "You do not have the permission to update this service",
//       });
//   const { username, email, phone, service, amount, date, time } = req.body;
//   if (username) res.booking.username = username;
//   if (email) res.booking.email = email;
//   if (phone) res.booking.phone = phone;
//   if (service) res.booking.service = service;
//   if (amount) res.booking.amount = amount;
//   if (date) res.booking.date = date;
//   if (time) res.booking.time = time;
//   try {
//     const updatedBooking = await res.booking.save();
//     res.status(201).send(updatedBooking);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// DELETE ONE
router.delete(
  "/:id",
  [authenticateToken, getBooking],
  async (req, res, next) => {
    try {
      await res.booking.remove();
      res.json({ message: "Deleted Booking" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

// FUNCTION TO GET BOOKING
async function getBooking(req, res, next) {
  let booking;
  try {
    booking = await Booking.findById(req.params.id);
    if (booking == null) {
      return res.status(404).json({ message: "Cannot find booking" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.booking = booking;
  next();
}

module.exports = router;
