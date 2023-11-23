const express = require('express');
const router = express.Router()
const TodoController = require("../controller/controller")
router.get("/", TodoController.getTodo);
router.get("/:id", TodoController.getTodoWithId);
router.get("/completedTodos", TodoController.getCompletedTodo);
router.get("/inCompletedTodos", TodoController.getInCompletedTodo);
router.put("/update/:id", TodoController.updateTodo);
router.post("/", TodoController.setTodo);
module.exports = router