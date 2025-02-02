const express = require("express");
const router = express.Router();
const { auth } = require("./auth");
const Workout = require("../models/Workout");

// Create a new workout
router.post("/", auth, async (req, res) => {
  try {
    const workout = new Workout({
      ...req.body,
      user: req.user._id,
    });
    await workout.save();
    res.status(201).json(workout);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error creating workout", error: error.message });
  }
});

// Get all workouts for the current user
router.get("/", auth, async (req, res) => {
  try {
    const { timeframe = "all" } = req.query;
    const now = new Date();
    let startDate;

    switch (timeframe) {
      case "week":
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case "month":
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case "year":
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default:
        startDate = null;
    }

    const query = { user: req.user._id };
    if (startDate) {
      query.date = { $gte: startDate };
    }

    const workouts = await Workout.find(query).sort({
      date: -1,
    });
    res.json(workouts);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching workouts", error: error.message });
  }
});

// Get workout by ID
router.get("/:id", auth, async (req, res) => {
  try {
    const workout = await Workout.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!workout) {
      return res.status(404).json({ message: "Workout not found" });
    }
    res.json(workout);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching workout", error: error.message });
  }
});

// Update workout
router.patch("/:id", auth, async (req, res) => {
  try {
    // Validate request body
    if (!req.body.exercises || !Array.isArray(req.body.exercises)) {
      return res.status(400).json({ message: "Invalid exercises data" });
    }

    // Validate each exercise
    for (const exercise of req.body.exercises) {
      if (
        !exercise.name ||
        !exercise.category ||
        !Array.isArray(exercise.sets)
      ) {
        return res.status(400).json({
          message: "Each exercise must have a name, category, and sets array",
        });
      }

      // Validate each set
      for (const set of exercise.sets) {
        if (
          typeof set.weight !== "number" ||
          typeof set.reps !== "number" ||
          !set.unit ||
          set.weight < 0 ||
          set.reps < 0
        ) {
          return res.status(400).json({
            message: "Each set must have valid weight, reps, and unit",
          });
        }
      }
    }

    const workout = await Workout.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!workout) {
      return res.status(404).json({ message: "Workout not found" });
    }

    // Update only the exercises field
    workout.exercises = req.body.exercises;
    await workout.save();

    res.json(workout);
  } catch (error) {
    console.error("Workout update error:", error);
    res.status(400).json({
      message: "Error updating workout",
      error: error.message,
    });
  }
});

// Delete workout
router.delete("/:id", auth, async (req, res) => {
  try {
    const workout = await Workout.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!workout) {
      return res.status(404).json({ message: "Workout not found" });
    }
    res.json({ message: "Workout deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting workout", error: error.message });
  }
});

// Get exercise statistics
router.get("/stats/exercises", auth, async (req, res) => {
  try {
    const { timeframe = "month" } = req.query;
    const now = new Date();
    let startDate;

    switch (timeframe) {
      case "week":
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case "month":
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case "year":
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default:
        startDate = new Date(now.setMonth(now.getMonth() - 1));
    }

    const workouts = await Workout.find({
      user: req.user._id,
      date: { $gte: startDate },
    }).sort({ date: 1 });

    const exerciseStats = workouts.reduce((stats, workout) => {
      workout.exercises.forEach((exercise) => {
        if (!stats[exercise.name]) {
          stats[exercise.name] = {
            category: exercise.category,
            frequency: 0,
            volumeOverTime: [],
          };
        }

        stats[exercise.name].frequency++;
        stats[exercise.name].volumeOverTime.push({
          date: workout.date,
          volume: exercise.sets.reduce(
            (total, set) => total + set.weight * set.reps,
            0
          ),
        });
      });
      return stats;
    }, {});

    res.json(exerciseStats);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching exercise statistics",
      error: error.message,
    });
  }
});

module.exports = router;
