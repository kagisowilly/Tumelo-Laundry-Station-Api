// DEPENDENCIES
const express = require("express");
const services = require("../models/services");
const router = express.Router();
const Services = require("../models/services");
const authenticateToken = require("./components/auth");

// GETTING ALL SERVICES
router.get("/", authenticateToken, async (req, res, next) => {
  try {
    const services = await services.find();
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GETTING ONE SERVICE
router.get("/:id", [authenticateToken, getService], (req, res, next) => {
  res.send(res.service);
});

// CREATE SERVICE
router.post("/",  authenticateToken, async (req, res, next) => {
  const service = new services({
    laundry_service: req.body.laundry_service,
    service_price: req.body.service_price,
    service_image: req.body.service_image,
  });
  try {
    const newService = await service.save();
    res.status(201).json(newService);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// UPDATE SERVICE
router.patch("/:id", [authenticateToken, getService], async (req, res, next) => {
  if (req.body.laundry_service != null) {
    res.service.laundry_service = req.body.laundry_service;
  }
  if (req.body.service_price != null) {
    res.service.service_price = req.body.service_price;
  }
  if (req.body.service_image != null) {
    res.service.service_image = req.body.service_image;
  }
  try {
    const updatedService = await res.service.save();
    res.json(updatedService);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE SERVICE
router.delete("/:id", [authenticateToken, getService], async (req, res, next) => {
  try {
    await res.service.remove();
    res.json({ message: "Deleted Service" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// FUNCTION TO GET SERVICES
async function  getService(req, res, next) {
  let service;
  try {
    service = await services.findById(req.params.id);
    if (service == null) {
      return res.status(404).json({ message: "Cannot Find The Services" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
  res.service = service;
  next();
}
module.exports = router;