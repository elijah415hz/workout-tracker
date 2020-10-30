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
    $("#addWorkoutForm").on("submit", function(event) {
        event.preventDefault()
        const workoutName = name.val()
        displayWorkout(workoutName)
    })
    $("#createBtn").on("click", function(event) {
        event.preventDefault()
        const workoutName = name.val()
        displayWorkout(workoutName)
    })
}

function displayWorkout(name) {
    const workspace = $("#workspace")
    workspace.empty();
    const header = $(`<h4 class="display-4 text-center">${name}</h4>`)
    const saveBtn = $("<button id='saveBtn' class='btn btn-success'>").text("Save")
    const headerCard = $("<div class='card mb-3'>")
    const headerCardBody = $("<div id='headerBody' class='card-body text-center'>")
    headerCardBody.append(header);
    headerCardBody.append(saveBtn)
    headerCard.append(headerCardBody);
    workspace.append(headerCard);
    const row = $("<div class='row mb-3'>");
    const emptyCol1 = $("<div class='col'>");
    const card = $('<form id ="addExerciseForm" class="card col-md-8 col-sm-12">');
    const emptyCol2 = $("<div class='col'>");
    const cardBody = $('<div class="card-body input-group">');
    const exercise = $('<input id="exercise" class="form-control mr-3" type="text" placeholder="Exercise">');
    const append = $('<div class="input-group-append">');
    const number = $('<input id="number" type="number" placeholder="0" class="form-control mr-3" style="width:80px">');
    const select = $('<select id="things" class="custom-select mr-3" style="width:100px">');
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
        const data = {
            exercise: exercise.val(),
            [select.val()]: number.val()
        }
        displayExercise(data)
    })
}

function displayExercise(data) {
    $("#exercise").val("");
    $("#things").val("");
    $("#number").val("");
    const headerBody = $("#headerBody")
    const row = $("<div class='row mt-3'>");
    const exercise = $("<div class='col-sm-6'>").text(data.exercise)
    
    const quantifier = Object.keys(data).filter(key => key !== "exercise")[0]
    console.log(quantifier)
    const number = $("<div class='col'>").text(data[quantifier])
    const thing = $("<div class='col'>").text(quantifier)
    row.append(exercise)
    row.append(number)
    row.append(thing)
    headerBody.append(row)
}

$("#newWorkoutBtn").on("click", createAddWorkout)