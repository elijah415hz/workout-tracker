const express = require("express");
const mongojs = require("mongojs");

const app = express();

const databaseUrl = "workout_tracker";
const collections = ["workouts"];

const db = mongojs(databaseUrl, collections);

db.on("error", error => {
  console.log("Database Error:", error);
});

// Set port for local and deployed
var PORT = process.env.PORT || 8080;

// Serve static content for the app from the "public" directory in the application directory.
app.use(express.static("public"));

// Parse application body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set Handlebars
// var exphbs = require("express-handlebars");

// app.engine("handlebars", exphbs({defaultLayout: "main"}));
// app.set("view engine", "handlebars");

// Import routes and give the server access to them.
require("./controllers/controller.js")(app);


app.listen(PORT, () => {
    console.log("App running on port " + PORT);
  });
  