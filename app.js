const express = require("express");
const mongoose = require("mongoose");
const router = require("./routes/index");
const app = express();

// connect the DataBase
var databaseUrl =
  "mongodb+srv://task:task123@task.sjtfy.mongodb.net/<dbname>?retryWrites=true&w=majority";
mongoose.connect(databaseUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
// End of DataBase Connection

// use main router
app.use("/", router);
// end of midlleware

// update Status
require("./custom_code/updateStatus");
// end of update Status

//listen on port 5000
app.listen(5000);
