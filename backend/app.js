const express = require('express');
const app = express();
const mongoose = require("mongoose");
const dotenv = require('dotenv');
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser');

dotenv.config();

// Middleware setup
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
}));

app.use(express.json()); 
app.use(bodyParser.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use(cookieParser()); 

app.use(express.static("public")); 


// Database connection
const URI = process.env.ATLASDB_URL;
const connect = async () => {
  try {
    const res = await mongoose.connect(URI);
    console.log("Database connected");
  } catch (error) {
    console.error("Error while connecting to the database", error);
  }
};
connect();

// Routes
const userRouter = require('./src/Routers/user.routes');
const contactRouter = require('./src/Routers/contact.routes');
app.use("/user", userRouter);
app.use("/contact", contactRouter);

// Basic route
app.get("/", (req, res) => {
  res.send("hi");
});

// Start server
app.listen(5000, () => {
  console.log('Server is running on port 5000');
});


//new changes

module.exports = app;
