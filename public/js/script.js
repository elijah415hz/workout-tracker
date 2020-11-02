let currentWorkout;
const workspace = $("#workspace")


$.ajax({
    type: "GET",
    url: "/api/workouts/populated",
}).then(workouts => {
    if (workouts.length > 0) {
        for (let workout of workouts) {
            console.log(workout._id)
            let workoutCard = displayWorkout(workout.name, false, workout._id);
            for (exercise of workout.exercises) {
                displayExercise(exercise, workoutCard, exercise._id)
            }
            addExerciseBtn = $(`<button class="btn btn-primary" id="addExerciseBtn">`).html("<i class='fa fa-plus'>")
            workoutCard.append(addExerciseBtn)
            
            addExerciseBtn.on("click", function () {
                currentWorkout = workout._id
                let headerCardBody = $(this).parent()
                let button = headerCardBody.children().eq(2)
                console.log(button)
                button.remove()
                const doneBtn = $("<button id='doneBtn' class='btn btn-success my-3'>").text("Done")
                headerCardBody.children().eq(1).after(doneBtn);
                workspace.append(headerCardBody.parent())
                displayAddExercise(workspace)
                $(this).remove()
                $("#doneBtn").on("click", function () {
                    location.reload()
                })
            })
        }
    } else {
        workspace.append($("<h3 class='text-center display-3'>").text("No saved workouts"))
    }
})


function createAddWorkout() {
    workspace.empty();
    const row = $("<div class='row mb-3'>");
    const card = $("<form id='addWorkoutForm' class='card col-sm-6 mx-auto'>");
    const cardBody = $("<div class='card-body text-center'>");
    const name = $('<input id="nameInput" class="form-control" type="text" placeholder="Workout Name">')
    const inputGroup = $('<div class="input-group">')
    const append = $('<div class="input-group-append">')
    const createBtn = $('<button id="createBtn" type="submit" class="btn btn-success">').text("Create")
    append.append(createBtn);
    inputGroup.append(name)
    inputGroup.append(append)
    cardBody.append(inputGroup)
    card.append(cardBody);
    row.append(card)
    workspace.append(row)

    $("#addWorkoutForm").on("submit", function (event) {
        event.preventDefault()
        let workoutName = name.val()
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
    }).catch(err => { console.error(err) })
}

function displayWorkout(name, newWorkout = true, workoutId) {
    workspace.empty();
    const header = $('<input id="workoutName" class="display-4 text-center" style="border:none;">').val(name)
    const headerCard = $("<div id='currentWorkout' class='card mb-3'>")
    const headerCardBody = $("<div id='headerBody' class='card-body text-center'>")
    headerCardBody.append(header);
    headerCardBody.append($("<br>"));
    headerCard.append(headerCardBody);

    header.on("change", function(){
        $.ajax({
            type: "PUT",
            url: "/api/workouts/" + (workoutId || currentWorkout),
            data: {
                name: header.val()
            }
        }).then(result=>{
            console.log(result)
        }).catch(err=>{
            console.error(err)
        })
    })

    if (newWorkout) {
        const doneBtn = $("<button id='doneBtn' class='btn btn-success my-3'>").text("Done")
        headerCardBody.append(doneBtn)
        workspace.append(headerCard);
        displayAddExercise(workspace)

        $("#doneBtn").on("click", function () {
            location.reload()
        })
    } else {
        const deleteWorkoutBtn = $(`<button id="deleteWorkoutBtn" data-workoutId="${workoutId}" class="btn btn-danger my-3">`).text("Delete Workout")
        headerCardBody.append(deleteWorkoutBtn)
        $("#savedWorkouts").append(headerCard)

        deleteWorkoutBtn.on("click", function () {
            $(this).parent().parent().remove()
            $.ajax({
                type: "DELETE",
                url: "/api/workouts/" + $(this).attr("data-workoutId")
            }).then(result => {
                console.log(result)
            }).catch(err => {
                console.error(err)
            })
        })

        return headerCardBody
    }
}

function displayAddExercise(appendLocation) {
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
    appendLocation.append(row);

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
            $("#select").val("");
            $("#exercise").val("");
            $("#number").val("");
        } else {
            alert("Please fill in all fields")
        }
    })
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

function displayExercise(data, appendLocation, exerciseId) {
    const row = $("<div class='row mb-3'>");
    const card = $('<form class="card mx-auto" >');
    const cardBody = $('<div class="card-body input-group">');
    if (exerciseId) {
        cardBody.attr("data-exerciseId", exerciseId)
    }
    const exercise = $(`<input  class="form-control mr-3" type="text" value="${data.name}" style="border:none;">`);
    const append = $('<div class="input-group-append">');
    const quantifier = Object.keys(data).filter(key => (key !== "name" && key !== "_id" && key !== "__v"))[0]
    const number = $(`<input  type="number" value="${data[quantifier]}" class="form-control mr-3" style="width:80px;border:none;">`);
    const select = $(`<select  class="form-control mr-3"style="width:100px;border:none;">`).val(quantifier);
    const reps = $('<option value="reps">').text("Reps");
    const minutes = $('<option value="minutes">').text("Minutes");
    const miles = $('<option value="miles">').text("Miles");
    const deleteBtn = $('<button id="deleteBtn" class="btn btn-danger">').html("<i class='fa fa-trash'></i>");
    select.append(reps);
    select.append(minutes);
    select.append(miles);
    append.append(number);
    append.append(select);
    append.append(deleteBtn)
    cardBody.append(exercise);
    cardBody.append(append);
    card.append(cardBody);
    row.append(card);
    select.children(`[value="${quantifier}"]`).prop('selected', true)
    appendLocation.append(row)

    cardBody.on("change", function () {
        //TODO: Are these selectors crazy?
        const exercise = $(this).children()[0].value;
        const number = $(this).children()[1].children[0].value;
        const quantifier = $(this).children()[1].children[1].value;
        const exerciseId = $(this).attr("data-exerciseId")
        updateExercise({
            name: exercise,
            [quantifier]: number
        }, exerciseId)
    })

    deleteBtn.on("click", function (event) {
        event.preventDefault()
        let exerciseId = $(this).parent().parent().attr("data-exerciseId")
        $(this).closest(".card-body").remove()
        $.ajax({
            type: "DELETE",
            url: "/api/exercises/" + exerciseId
        }).then(result => {
            console.log(result)

        }).catch(err => {
            console.error(err)
        })
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