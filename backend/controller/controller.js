const redisClient = require("../config/redis");
const Todo = require("../models/ToDoModel");

const getTodo = async (req, res) => {
  try {
    redisClient.get("todos", async (err, cachedData) => {
      if (err) throw err;

      if (cachedData) {
        // Redis'te varsa, Redis'ten veriyi al
        const todos = JSON.parse(cachedData).filter((todo) => !todo.completed);
        res.json(todos);
      } else {
        // Redis'te yoksa, MongoDB'den veriyi al
        const todos = await Todo.find({ completed: false });

        // Veriyi Redis'e kaydet
        if (todos.length > 0) {
          redisClient.setex("todos", 3600, JSON.stringify(todos));
          res.json(todos);
        } else {
          res.status(404).json({ message: "No incomplete todos found" });
        }
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
const getTodoWithId = async (req, res) => {
  try {
    const todoId = req.params.id;

    // Önce Redis'te kontrol et
    redisClient.get(todoId, async (err, cachedData) => {
      if (err) throw err;

      if (cachedData) {
        // Redis'te varsa, Redis'ten veriyi al
        res.json(JSON.parse(cachedData));
      } else {
        // Redis'te yoksa, MongoDB'den veriyi al
        const todo = await Todo.findById(todoId);

        // Veriyi Redis'e kaydet
        if (todo) {
          redisClient.setex(todoId, 3600, JSON.stringify(todo));
          res.json(todo);
        } else {
          res.status(404).json({ message: "Todo not found" });
        }
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
const getCompletedTodo = async (req, res) => {
  try {
    // Önce Redis'te kontrol et
    redisClient.get("completedTodos", async (err, cachedData) => {
      if (err) throw err;

      if (cachedData) {
        // Redis'te varsa, Redis'ten veriyi al
        const completedTodos = JSON.parse(cachedData).filter(
          (todo) => todo.completed
        );
        res.json(completedTodos);
      } else {
        // Redis'te yoksa, MongoDB'den veriyi al
        const completedTodos = await Todo.find({ completed: true });

        // Veriyi Redis'e kaydet
        if (completedTodos.length > 0) {
          redisClient.setex(
            "completedTodos",
            3600,
            JSON.stringify(completedTodos)
          );
          res.json(completedTodos);
        } else {
          res.status(404).json({ message: "No completed todos found" });
        }
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
const getInCompletedTodo = async (req, res) => {
  try {
    // Önce Redis'te kontrol et
    redisClient.get("completedTodos", async (err, cachedData) => {
      if (err) throw err;

      if (cachedData) {
        // Redis'te varsa, Redis'ten veriyi al
        const completedTodos = JSON.parse(cachedData).filter(
          (todo) => todo.completed
        );
        res.json(completedTodos);
      } else {
        // Redis'te yoksa, MongoDB'den veriyi al
        const completedTodos = await Todo.find({ completed: false });

        // Veriyi Redis'e kaydet
        if (completedTodos.length > 0) {
          redisClient.setex(
            "completedTodos",
            3600,
            JSON.stringify(completedTodos)
          );
          res.json(completedTodos);
        } else {
          res.status(404).json({ message: "No completed todos found" });
        }
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
const setTodo = async (req, res) => {
  try {
    const { title, description } = req.body;

    const todo = new Todo({
      title,
      description,
      completed: false,
    });

    await todo.save();

    // Redis'teki tüm önbelleği temizle
    redisClient.flushall();

    res.json(todo);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
const updateTodo = async (req, res) => {
  try {
    const todoId = req.params.id;

    // MongoDB'de güncelleme yap
    const updatedTodo = await Todo.findByIdAndUpdate(
      todoId,
      { completed: true },
      { new: true } 
    );

    if (!updatedTodo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    // Redis'teki tüm önbelleği temizle
    redisClient.flushall();

    res.json(updatedTodo);

    res.json(todo);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
module.exports = {
  getTodo,
  setTodo,
  getTodoWithId,
  getCompletedTodo,
  getInCompletedTodo,
  updateTodo,
};
