let currentWorkout;

$.ajax({
    type: "GET",
    url: "/api/workouts/populated",
}).then(workouts => {
    if (workouts.length > 0) {
        for (let workout of workouts) {
            console.log(workout._id)
            let workoutCard = displayWorkout(workout.name, false);
            for (exercise of workout.exercises) {
                displayExercise(exercise, workoutCard, exercise._id)
            }
        }
    }
})


function createAddWorkout() {
    const workspace = $("#workspace")
    workspace.empty();
    const row = $("<div class='row mb-3'>");
    const emptyCol1 = $("<div class='col'>");
    const emptyCol2 = $("<div class='col'>");
    const card = $("<form id='addWorkoutForm' class='card col-sm-6'>");
    const cardBody = $("<div class='card-body text-center'>");
    const name = $('<input id="nameInput" class="form-control" type="text" placeholder="Workout Name">')
    const inputGroup = $('<div class="input-group">')
    const append = $('<div class="input-group-append">')
    const createBtn = $('<button id="createBtn" type="button" class="btn btn-success">').text("Create")
    append.append(createBtn);
    inputGroup.append(name)
    inputGroup.append(append)
    cardBody.append(inputGroup)
    card.append(cardBody);
    row.append(emptyCol1);
    row.append(card)
    row.append(emptyCol2);
    workspace.append(row)
    $("#addWorkoutForm").on("submit", function (event) {
        event.preventDefault()
        const workoutName = name.val()
        storeWorkout(workoutName)
        displayWorkout(workoutName)
    })
    $("#createBtn").on("click", function (event) {
        event.preventDefault()
        const workoutName = name.val()
        storeWorkout(workoutName)
        displayWorkout(workoutName)
    })
}

function storeWorkout(name) {
    $.ajax({
        type: "POST",
        url: "/api/workouts",
        data: {
            name: name
        }
    }).then(result => {
        currentWorkout = result._id
        console.log(result)
    })
        .catch(err => { console.error(err) })
}

function displayWorkout(name, newWorkout = true) {
    const workspace = $("#workspace")
    workspace.empty();
    const header = $('<h4 id="workoutName" class="display-4 text-center">').text(name)
    const doneBtn = $("<button id='doneBtn' class='btn btn-success'>").text("Done")
    const headerCard = $("<div id='currentWorkout' class='card mb-3'>")
    const headerCardBody = $("<div id='headerBody' class='card-body text-center'>")
    headerCardBody.append(header);
    headerCard.append(headerCardBody);
    if (newWorkout) {
        headerCardBody.append(doneBtn)
        workspace.append(headerCard);
        const row = $("<div class='row mb-3'>");
        const emptyCol1 = $("<div class='col'>");
        const card = $('<form id ="addExerciseForm" class="card col-md-8 col-sm-12">');
        const emptyCol2 = $("<div class='col'>");
        const cardBody = $('<div class="card-body input-group">');
        const exercise = $('<input id="exercise" class="form-control mr-3" type="text" placeholder="Exercise">');
        const append = $('<div class="input-group-append">');
        const number = $('<input id="number" type="number" placeholder="0" class="form-control mr-3" style="width:80px">');
        const select = $('<select id="select" class="custom-select mr-3" style="width:100px">');
        const reps = $('<option value="reps">').text("Reps");
        const minutes = $('<option value="minutes">').text("Minutes");
        const miles = $('<option value="miles">').text("Miles");
        const add = $('<button id="addBtn" class="btn btn-success">').text("Add");
        select.append(reps);
        select.append(minutes);
        select.append(miles);
        append.append(number);
        append.append(select);
        append.append(add);
        cardBody.append(exercise);
        cardBody.append(append);
        card.append(cardBody);
        row.append(emptyCol1);
        row.append(card);
        row.append(emptyCol2);
        workspace.append(row);
        $("#addExerciseForm").on("submit", function (event) {
            event.preventDefault();
            const select = $("#select").val()
            const exercise = $("#exercise").val()
            const number = $("#number").val()
            console.log("Selected: ", select)
            if (select && exercise && number) {
                const data = {
                    name: exercise,
                    [select]: number
                }
                storeExercise(data)
                displayExercise(data, $("#currentWorkout"))
            } else {
                alert("Please fill in all fields")
            }
        })
        $("#doneBtn").on("click", function () {
            location.reload()
        })
    } else {
        $("#savedWorkouts").append(headerCard)
        return headerCard
    }
}

function storeExercise(data) {
    $.ajax({
        type: "POST",
        url: "/api/exercises",
        data: {
            exercise: data,
            workoutId: currentWorkout
        }
    }).then(result => {
        console.log(result)
    }).catch(err => { console.error(err) })
}

function displayExercise(data, location, exerciseId) {
    $("#select").val("");
    $("#exercise").val("");
    $("#number").val("");
    
    const row = $("<div class='row mb-3'>");
    const emptyCol1 = $("<div class='col'>");
    const card = $('<form id ="" class="card" >');
    const emptyCol2 = $("<div class='col'>");
    const cardBody = $('<div class="card-body input-group">');
    if (exerciseId) {
        cardBody.attr("data-exerciseId", exerciseId)
    }
    const exercise = $(`<input id="" class="form-control mr-3" type="text" value="${data.name}" style="border:none;">`);
    const append = $('<div class="input-group-append">');
    const quantifier = Object.keys(data).filter(key => (key !== "name" && key !== "_id" && key !== "__v"))[0]
    console.log(quantifier)
    const number = $(`<input id="" type="number" value="${data[quantifier]}" class="form-control mr-3" style="width:80px;border:none;">`);
    const select = $(`<select id="" class="form-control mr-3"style="width:100px;border:none;">`).val(quantifier);
    const reps = $('<option value="reps">').text("Reps");
    const minutes = $('<option value="minutes">').text("Minutes");
    const miles = $('<option value="miles">').text("Miles");
    select.append(reps);
    select.append(minutes);
    select.append(miles);
    append.append(number);
    append.append(select);
    cardBody.append(exercise);
    cardBody.append(append);
    card.append(cardBody);
    row.append(emptyCol1)
    row.append(card);
    row.append(emptyCol2)
    select.children(`[value="${quantifier}"]`).prop('selected', true)
    location.append(row)
    cardBody.on("change", function() {
        const exercise = $(this).children()[0].value;
        const number = $(this).children()[1].children[0].value;
        const quantifier = $(this).children()[1].children[1].value;
        const exerciseId = $(this).attr("data-exerciseId")
        updateExercise({
            name: exercise,
            [quantifier]: number,
        }, exerciseId)
        
    })
}

function updateExercise(data, id) {
    console.log(data)
    $.ajax({
        type: "PUT",
        url: "/api/exercises/" + id,
        data: data        
    }).then(result => {
        console.log(result)
    }).catch(err => { console.error(err) })
}

$("#newWorkoutBtn").on("click", createAddWorkout)