// DEPENDENCIES
const express = require("express");
const router = express.Router();
const Services = require("../models/services");
const authenticateToken = require("./components/auth");

// GETTING ALL SERVICES
router.get("/", async (req, res, next) => {
  try {
    const services = await Services.find();
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log(message)
  }
});

// GETTING ONE SERVICE
router.get("/:id", [ getService], (req, res, next) => {
  res.send(res.service);
});

// CREATE SERVICE
router.post("/", authenticateToken, async (req, res, next) => {
  const { laundry_service, service_price, service_image, } = req.body;

  let service;

  service_image
    ? (service = new Services({
      laundry_service,
      service_price,
      service_image,
      author: req.user._id
      }))
    : (service = new Services({
      laundry_service,
      service_price,
      service_image,
      author: req.user._id
      }));

  try {
    const newService = await service.save();
    res.status(201).json(newService);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
// UPDATE SERVICE
router.put("/:id", [authenticateToken, getService], async (req, res, next) => {
  if (req.user._id !== res.service.author)
    res
      .status(400)
      .json({ message: "You do not have the permission to update this service" });
  const { laundry_service, service_price, service_image, } = req.body;
  if (laundry_service) res.service.laundry_service = laundry_service;
  if (service_price) res.service.service_price = service_price;
  if (service_image) res.service.service_image = service_image;

  try {
    const updatedService = await res.service.save();
    res.status(201).send(updatedService);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE SERVICE
router.delete("/:id", [authenticateToken, getService], async (req, res, next) => {
  if (req.user._id !== res.service.author)
  res
    .status(400)
    .json({ message: "Yoau do not have the permission to delete this product" });
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
    service = await Services.findById(req.params.id);
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