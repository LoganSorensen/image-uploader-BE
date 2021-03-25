const mongoose = require("mongoose");

const imageSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  image: { type: String, required: true },
});

module.exports = mongoose.model("Image", imageSchema);
