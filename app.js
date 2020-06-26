const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const productRoutes = require("./api/routes/products");
const userRoutes = require("./api/routes/users");
const infoRoutes = require("./api/routes/info");
require("dotenv").config();

// Connect to Mongo Atlas db
mongoose.connect(
  "mongodb+srv://kobo:kobo@node-rest-api-mwbhc.mongodb.net/<dbname>?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true }
);

// for production
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Our app is running on port ${PORT}`);
});

// Request middleware
app.use(morgan("dev")); // To get every request Information in terminal
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Add CORS policy
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");

  if (req.method === "OPTIONS") {
    res.header(
      "Access-Control-Allow-Methods",
      "POST, GET, PUT, DELETE, OPTIONS, PATCH"
    );
    return res.status(200).json({});
  }

  next();
});

// Routes
app.use("/products", productRoutes);
app.use("/users", userRoutes);
app.use("/api/v1/", infoRoutes);

// To handle not found - status code 404
app.use((req, res, next) => {
  const error = new Error("Not Found!");
  error.status = 404;
  next(error);
});

// To handle internal server error - status code 500
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;
