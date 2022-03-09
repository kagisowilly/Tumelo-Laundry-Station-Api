// DEPENDENCIES
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

// CONNECTING TO THE DATABASE
mongoose.connect('mongodb+srv://kagisomphayi:bIKEbqmoRTpf9Waw@subscribers.psvk2.mongodb.net/bookingSystems?retryWrites=true&w=majority');

const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to Database"));

const app = express();
app.set("port", process.env.PORT || 3500);
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  const _rootUrl = req.get("host") + req.url;
  res.send({
    msg: "Welcome to the API. Check the routes object ",
    routes: {
      contact: `${_rootUrl}contact`,
    },
  });
});

// CONNECTING ROUTES
const usersRouter = require("./routes/usersRouter");
app.use("/users", usersRouter);

const servicesRouter = require("./routes/servicesRouter");
app.use("/services", servicesRouter);


// const cartRouter = require("./routes/cartRouter");
// app.use("/cart", cartRouter);

app.listen(app.get("port"), () => {
  console.log(`Listening for calls on port ${app.get("port")}`);
});