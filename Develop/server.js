// requirements
var express = require("express");
var path = require("path");
var fs = require("fs");
var noteLog = require("./db/db.json");

// function to update the database
function updateDB() {
    fs.writeFile("db/db.json", JSON.stringify(noteLog), function () {
        console.log(noteLog);
        console.log("Updated DB!");
    });
}
// function to find the next unique id number
function highestNum(x){
    let high = 0;
    
    // find the highest number
    x.forEach((note) => {
        if(note.id > high) {
            high = note.id
        };
    });

    // add one and return it
    high += 1;
    return high;
}

// set expres and port
var app = express();
var PORT = process.env.PORT || 8889;

// I am not sure how this works***
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// return the notes from the database when requested
app.get("/api/notes", function (req, res) {
    
    return res.json(noteLog);
});

// When posted, add the new note to the master list and update the database.
app.post("/api/notes", function (req, res) {

    var newNote = req.body;

    newNote.id = highestNum(noteLog)

    noteLog.push(newNote);

    updateDB()

    return res.status(200).end();
});

// When delete request, kick off this function
app.delete("/api/notes/:id", function (req, res) {

    // parse the id from delete request
    const deleteID = req.params.id;
    // define a new variable to store the index position of the note to be deleted in the noteLog array
    let arrIndex = -1;

    // find the note that has the requested id, and save it's index position using the arrIndex variable
    for (let i = 0; i < noteLog.length; i++) {
        if (noteLog[i].id == deleteID){
            arrIndex = i
        };
    };

    // take out the requested note and update the database
    noteLog.splice(arrIndex, 1);
    updateDB()

    return res.status(200).end();
});

// define the where express should position itself while looking for files???
app.use(express.static("public"));

// return the notes page when the URL ends with /notes
app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "public/notes.html"));
});

// return the home page if anything else
app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "public/index.html"));
});

// listen for user activity
app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});  