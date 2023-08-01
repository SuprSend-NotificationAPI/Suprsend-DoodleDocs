const mongoose = require("mongoose");
const { Schema } = mongoose;

const collaboratorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
});

const DocSchema = new Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  textfile: {
    type: String,
  },
  collaborators: [collaboratorSchema],
  date: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("Docs", DocSchema);
