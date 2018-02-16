const mongoose = require("mongoose");

// Define schema
const Schema = mongoose.Schema;

const GifSchema = new Schema({
  url: String,
  title: String,
  desc: String,
  width: { type: Number, default: 200 },
  height: { type: Number, default: 200 },
  updated: { type: Date, default: Date.now }
});

// Compile model from schema
module.exports = mongoose.models.Gif || mongoose.model("Gif", GifSchema);
