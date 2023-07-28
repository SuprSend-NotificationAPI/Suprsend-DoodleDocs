const mongoose = require("mongoose");
const { Schema } = mongoose;

const DocSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  textfile: {
    type: String,
  },
  owner :{
    type : mongoose.Schema.Types.ObjectId,
    ref:"user",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("Docs", DocSchema);
