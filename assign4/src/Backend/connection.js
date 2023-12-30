const express = require("express");
const mongoose = require("mongoose");
const routes = require("../Backend/routes");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use("/", routes);

const host = "localhost";
const port = 3001;

app.listen(port, host, () => {
  console.log("Server running on port " + port);
});

mongoose.connect("mongodb://127.0.0.1:27017/BlogUsers");

const db = mongoose.connection;
db.on("error", () => {
  console.log("Cannot connect to db");
});
db.once("open", () => {
  console.log("DB connected successfully");
});
