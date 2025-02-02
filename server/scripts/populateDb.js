const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const User = require("../models/User");
const Workout = require("../models/Workout");

dotenv.config();

// Sample exercise data
const exerciseData = {
  push: [
    "Bench Press",
    "Overhead Press",
    "Incline Bench Press",
    "Tricep Extensions",
    "Push-ups",
  ],
  pull: [
    "Pull-ups",
    "Barbell Rows",
    "Lat Pulldowns",
    "Face Pulls",
    "Bicep Curls",
  ],
  legs: ["Squats", "Deadlifts", "Leg Press", "Lunges", "Calf Raises"],
  chest: ["Dumbbell Flyes", "Cable Crossovers", "Dips", "Decline Bench Press"],
  back: ["Chin-ups", "T-Bar Rows", "Seated Cable Rows", "Good Mornings"],
  shoulders: [
    "Lateral Raises",
    "Front Raises",
    "Reverse Flyes",
    "Military Press",
  ],
  arms: [
    "Hammer Curls",
    "Skull Crushers",
    "Preacher Curls",
    "Diamond Push-ups",
  ],
  core: ["Planks", "Russian Twists", "Leg Raises", "Cable Crunches"],
  cardio: ["Running", "Cycling", "Jump Rope", "Rowing"],
};

// Generate random number between min and max
const randomBetween = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

// Generate random sets for an exercise
const generateSets = () => {
  const numSets = randomBetween(3, 5);
  const sets = [];

  for (let i = 0; i < numSets; i++) {
    sets.push({
      weight: randomBetween(10, 225),
      reps: randomBetween(5, 15),
      unit: Math.random() > 0.8 ? "kg" : "lbs",
    });
  }

  return sets;
};

// Generate random exercises for a workout
const generateExercises = () => {
  const numExercises = randomBetween(3, 8);
  const exercises = [];
  const categories = Object.keys(exerciseData);

  for (let i = 0; i < numExercises; i++) {
    const category = categories[randomBetween(0, categories.length - 1)];
    const exerciseList = exerciseData[category];
    const exerciseName =
      exerciseList[randomBetween(0, exerciseList.length - 1)];

    exercises.push({
      name: exerciseName,
      category,
      sets: generateSets(),
      notes: Math.random() > 0.7 ? "Feeling strong today!" : "",
    });
  }

  return exercises;
};

// Generate workouts for a user
const generateWorkouts = async (userId, numWorkouts) => {
  const workouts = [];
  const now = new Date();

  for (let i = 0; i < numWorkouts; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - i); // Create workouts for past days

    const workout = new Workout({
      user: userId,
      date,
      exercises: generateExercises(),
      notes: Math.random() > 0.8 ? "Great workout session!" : "",
    });

    workouts.push(workout);
  }

  return Promise.all(workouts.map((workout) => workout.save()));
};

// Main function to populate the database
async function populateDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(
      process.env.MONGODBURI || "mongodb://localhost:27017/workout-logs",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );

    console.log("Connected to MongoDB");

    // Clear existing data
    await User.deleteMany({});
    await Workout.deleteMany({});

    console.log("Cleared existing data");

    // Create sample users
    const users = [
      {
        username: "john_doe",
        email: "john@example.com",
        password: "password123",
      },
      {
        username: "jane_smith",
        email: "jane@example.com",
        password: "password123",
      },
      {
        username: "bob_wilson",
        email: "bob@example.com",
        password: "password123",
      },
    ];

    // Save users and generate workouts for each
    for (const userData of users) {
      const user = new User(userData);
      await user.save();
      console.log(`Created user: ${user.username}`);

      // Generate 30 workouts for each user
      await generateWorkouts(user._id, 30);
      console.log(`Generated workouts for: ${user.username}`);
    }

    console.log("Database population completed successfully!");
  } catch (error) {
    console.error("Error populating database:", error);
  } finally {
    await mongoose.connection.close();
    console.log("Database connection closed");
  }
}

// Run the population script
populateDatabase();
