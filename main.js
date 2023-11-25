const express = require("express");
const multer = require('multer');
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.raw({ type: 'text/plain' }));
app.use(multer().any());
app.use("/", express.static(__dirname + '/static'));

var notes = [];

app.get("/notes", (req, res) => {
  res.json(notes);
});

app.post("/upload", (req, res) => {
  var note = req.body.note_name;

  if (!note) {
    return res.sendStatus(400); 
  }

  if (notes.map(a => a.note_name).includes(note)) {
    return res.sendStatus(400); 
  }

  notes.push(req.body);
  res.sendStatus(201); 
  console.log(notes);
});

app.get("/notes/:noteName", (req, res) => {
  const note = req.params.noteName;
  const noteIndex = notes.findIndex(n => n.note_name === note);

  if (noteIndex !== -1) {
    res.send(notes[noteIndex].note);
  } else {
    res.sendStatus(404); 
  }
});

app.delete("/notes/:noteName", (req, res) => {
  const note = req.params.noteName;
  const noteIndex = notes.findIndex(n => n.note_name === note);

  if (noteIndex !== -1) {
    notes.splice(noteIndex, 1);
    res.sendStatus(200); 
  } else {
    res.sendStatus(404); 
  }
});

app.put("/notes/:noteName", (req, res) => {
  const note = req.params.noteName;
  const noteIndex = notes.findIndex(n => n.note_name === note);

  if (noteIndex !== -1) {
    notes[noteIndex].note = req.body.toString();
    res.sendStatus(200); 
  } else {
    res.sendStatus(404); 
  }
});

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
