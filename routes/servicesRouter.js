// DEPENDENCIES
const express = require("express");
require("dotenv").config;
const router = express.Router();
const Services = require("../models/services");
const Users = require("../models/users");
const  {authenticateToken } = require("../middleware/auth");
const { getUser, getService } = require("../middleware/get");

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
router.post("/",authenticateToken, async (req, res, next) => {

  const { laundry_service, service_image,service_price} = req.body;

  var service = new Services({
        service_image,
        service_price,
        laundry_service,
        author: req.user._id,
      });


  try {
    const newService = await service.save();
    res.status(201).json(newService);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// router.post("/",  async(req, res, next)=>{
//   const {laundry_service, service_image, service_price} = req.body
//   const newService = await new Services(req.body)

//   try{
//       const savedService = await newService.save()
//       res.status(200).json(savedService)
//   }catch(error){
//       res.status(500).json(error)
//   }
// });


// UPDATE SERVICE
// UPDATE a product
router.put("/:id", [authenticateToken, getService], async (req, res, next) => {
  if (req.user._id !== res.service.author)
    res
      .status(400)
      .json({ message: "You do not have the permission to update this Service" });
  const { laundry_service, service_image,service_price } = req.body;
  if (laundry_service) res.service.laundry_service = laundry_service;
  if (service_image) res.service.service_image = service_image;
  if (service_price) res.service.service_price = service_price;

  try {
    const updatedService= await res.service.save();
    res.status(201).send(updatedService);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// router.put("/:id", [authenticateToken ,getService], async (req, res, next) => {
//   if (req.user._id !== res.service.author)
//     res
//       .status(400)
//       .json({ message: "You do not have the permission to update this service" });
//   const { laundry_service, service_price, service_image, } = req.body;
//   if (laundry_service) res.service.laundry_service = laundry_service;
//   if (service_price) res.service.service_price = service_price;
//   if (service_image) res.service.service_image = service_image;

//   try {
//     const updatedService = await res.service.save();
//     res.status(201).send(updatedService);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// DELETE SERVICE
router.delete("/:id", [authenticateToken, getService], async (req, res, next) => {
  if (req.user._id !== res.service.author)
    res
      .status(400)
      .json({ message: "Yoau do not have the permission to delete this Service" });
  try {
    await res.service.remove();
    res.json({ message: "Deleted Service" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// router.delete("/:id", [ getService], async (req, res, next) => {
//   try {
//     await res.service.remove();
//     res.json({ message: "Deleted Service" });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });


module.exports = router;