const mongoose = require("mongoose");

const periodSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  lastPeriod: { type: String, required: true },
  cycleLength: { type: Number, required: true },
  periodLength: { type: Number, required: true },
  monthsToCalculate: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Period", periodSchema);
