const mongoose = require("mongoose");

const setSchema = new mongoose.Schema({
  weight: {
    type: Number,
    required: true,
  },
  reps: {
    type: Number,
    required: true,
  },
  unit: {
    type: String,
    enum: ["lbs", "kg"],
    default: "lbs",
  },
});

const exerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    trim: true,
    enum: [
      "push",
      "pull",
      "legs",
      "chest",
      "back",
      "shoulders",
      "arms",
      "core",
      "cardio",
      "other",
    ],
  },
  sets: [setSchema],
  notes: String,
});

const workoutSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
      required: true,
    },
    exercises: [exerciseSchema],
    notes: String,
  },
  {
    timestamps: true,
  }
);

// Virtual for calculating total volume (weight * reps) for each exercise
workoutSchema.virtual("exerciseVolumes").get(function () {
  return this.exercises.map((exercise) => ({
    name: exercise.name,
    volume: exercise.sets.reduce(
      (total, set) => total + set.weight * set.reps,
      0
    ),
  }));
});

const Workout = mongoose.model("Workout", workoutSchema);

module.exports = Workout;
