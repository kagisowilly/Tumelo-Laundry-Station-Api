const Users = require("../models/users");
const Booking = require("../models/booking");
const Services = require("../models/services");


// FUNCTION TO GET SERVICES
async function  getService(req, res, next) {
    let service;
    try {
      service = await Services.findById(req.params.id);
      if (!service) {
        return res.status(404).json({ message: "Cannot Find The Services" });
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
    res.service = service;
    next();
  }

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

  // FUNCTION TO GET USER ID
async function getUser(req, res, next) {
    let user;
    try {
      user = await Users.findById(req.params.id);
      if (user == null) {
        return res.status(404).json({ message: "Cannot find user" });
      }
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
    res.user = user;
    next();
  }

  module.exports = { getUser, getService, getBooking };