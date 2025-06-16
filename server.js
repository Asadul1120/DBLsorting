require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");
const employerRoutes = require("./routes/employerRoutes");
const userRoutes = require("./routes/userRoutes");


const app = express();

// Database connection
connectDB();

// Middleware
app.use(cors());
app.use(express.json()); 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use("/employers", employerRoutes);
app.use("/users", userRoutes);
// Home route
app.get("/", (req, res) => res.send("Welcome to the Product Inventory API"));

// Error handling
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
