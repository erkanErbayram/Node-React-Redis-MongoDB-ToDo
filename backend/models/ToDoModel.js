const mongoose = require("mongoose");
const TodoSchema = new mongoose.Schema({
    title: String,
    description: String,
    completed: Boolean,
  });
  
  module.exports = Todos = mongoose.model("todos", TodoSchema);