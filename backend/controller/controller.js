const redisClient = require("../config/redis");
const Todo = require("../models/ToDoModel");
const getTodo = async (req, res) => {
  const key = "todos";
  let value;
  try {
    let redisValue = await redisClient.get(key);
    if (redisValue != null && redisValue.length > 0) {
      const parsedData = JSON.parse(redisValue);
      value = parsedData.map((todo) => ({
        title: todo.title,
        description: todo.description,
        completed: todo.completed,
      }));
    } else {
      value = await Todo.find({ completed: false });
      redisClient.SETEX(key, 3600, JSON.stringify(value));
      console.log("Todos from MongoDB");
    }
    res.json(value);
  } catch (error) {
    console.error("Hata:", error);
    return res.status(500).json({ message: "Internal Server Error" });
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
          redisClient.set(todoId, JSON.stringify(todo));
          redisClient.expire(todoId, 3600);
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
          redisClient.set("completedTodos", JSON.stringify(completedTodos));
          redisClient.expire("completedTodos", 3600);
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
  const key = "todos";
  try {
    const { title, description } = req.body;

    const todo = new Todo({
      title,
      description,
      completed: false,
    });

    await todo.save();

    // Redis'teki tüm önbelleği temizle
    // redisClient.flushall();
    // Redis verilerini temizle
    redisClient.del(key);

    // MongoDB'den tüm verileri çek
    const todosFromMongo = await Todo.find({});

    // Redis'e kaydet
    if (todosFromMongo.length > 0) {
      redisClient.set(key, JSON.stringify(todosFromMongo));
      redisClient.expire(key, 3600);
    }

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
