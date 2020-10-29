const mongoose = require("mongoose");
const db = require("../models")


module.exports = function (app) {

  // Get route
  app.get("/api/workouts/populated", function (req, res) {
    db.Workout.find({}).populate("exercises").then(data => {
      res.json(data)
    })
  });
 
  app.get("/api/workouts", function (req, res) {
    db.Workout.find({}).then(data => {
      res.json(data)
    })
  });

  // POST route 
  app.post("/api/workouts", async function (req, res) {
    try {
      let exercises = req.body.exercises
      let workout = await db.Workout.create({ name: req.body.workout })
      let inserted = await db.Exercise.insertMany(exercises)
      for (let exercise of inserted) {
        workout = await db.Workout.findOneAndUpdate({ name: req.body.workout }, {
          $push: { exercises: exercise._id }
        },
        { new: true }
        )
      }
      res.json(workout)
    } catch(err) {
      console.error(err);
      res.json(err)
    }
  })


  // DELETE route 
  app.delete("/api/workouts/:id", async function (req, res) {
    try {
      let workout = await db.Workout.findOne({_id: mongoose.Types.ObjectId(req.params.id)});
      let exerciseIds = workout.exercises
      for (let eId of exerciseIds) {
        let eDeleted = await db.Exercise.remove({_id: mongoose.Types.ObjectId(eId)})
        console.log(eDeleted)
      }
      let wDeleted = await db.Workout.remove({_id: mongoose.Types.ObjectId(req.params.id)})
      res.send(wDeleted)
    } catch(err) {
      console.error(err);
      res.json(err)
    }

  });

  app.delete("/api/exercises/:id", async function (req, res) {
    // TODO: Delete the _id from the corresponding Workouts document as well
    try{
      let deleted = await db.Exercise.remove({_id: mongoose.Types.ObjectId(req.params.id)})
      res.json(deleted)
    } catch(err){
      console.error(err);
      res.json(err);
    }
  })

  // PUT route
  app.put("/api/exercises/:id", function (req, res) {
    db.Exercise.replaceOne({_id: mongoose.Types.ObjectId(req.params.id)}, 
    req.body,
    {
      new: true
    }).then(data=>{
      res.json(data)
    }).catch(err=>{
      console.error(err);
      res.json(err)
    })
  });

  app.put("/api/workouts/:id", function (req, res) {
    db.Workout.updateOne({_id: mongoose.Types.ObjectId(req.params.id)},
    {
      $set: req.body
    }).then(data=>{
      res.json(data)
    }).catch(err=>{
      console.error(err);
      res.json(err)
    })
  })
};
