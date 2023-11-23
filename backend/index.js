const express = require("express");
const app = express();
const dbConnect = require("./config/db")
require("dotenv").config();

//<---BODYPARSER-->
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
//<---BODYPARSER-->

//<---Mongo DB CONNECT--->
dbConnect();
//<---Mongo DB CONNECT--->

app.get('/',(req,res)=>{
    res.send("ToDo List API")
})
app.use("/api/todos", require("./routes/router"));
app.listen(process.env.PORT, () => {
  console.log(`Server Running on port ${process.env.PORT}`);
});