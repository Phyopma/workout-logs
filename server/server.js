const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection with enhanced error handling
const connectDB = async () => {
  try {
    const mongoURI =
      process.env.MONGODBURI || "mongodb://localhost:27017/workout-logs";
    console.log("Attempting to connect to MongoDB...");

    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    });

    console.log("Successfully connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    // Exit process with failure if this is a critical error
    process.exit(1);
  }
};

// Initialize MongoDB connection
connectDB();

// Import and use routes
const authRoutes = require("./routes/auth").router;
const workoutRoutes = require("./routes/workouts");

app.use("/auth", authRoutes);
app.use("/workouts", workoutRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// Start server
const port = process.env.PORT;

console.log(port);
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
