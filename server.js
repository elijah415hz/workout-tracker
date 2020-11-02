const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");

var PORT = process.env.PORT || 8080;

const app = express();

app.use(logger("dev"));

// Serve static content for the app from the "public" directory in the application directory.
app.use(express.static("public"));

// Parse application body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/workoutdb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
});

// Set Handlebars
// var exphbs = require("express-handlebars");

// app.engine("handlebars", exphbs({defaultLayout: "main"}));
// app.set("view engine", "handlebars");

// Import routes and give the server access to them.
require("./controllers/controller.js")(app);

app.listen(PORT, () => {
    console.log("App running on port " + PORT);
  });
  