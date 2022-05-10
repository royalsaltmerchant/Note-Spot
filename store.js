function NoteStore() {
  this.getStoredNotes = function() {
    var notes;

    if(localStorage.getItem('notes') === null) {
      notes = []
    } else {
      notes = JSON.parse(localStorage.getItem('notes'))
    }

    return notes
  }

  this.addNote = function(note) {
    var notes = this.getStoredNotes()

    notes.push(note)

    localStorage.setItem('notes', JSON.stringify(notes))
  }

  this.saveNote = function(noteToSave) {
    var notes = this.getStoredNotes()

    var noteIndex = notes.findIndex(note => noteToSave.id === note.id)
    notes[noteIndex] = noteToSave

    localStorage.setItem('notes', JSON.stringify(notes))
  }

  this.removeNote = function(id) {
    var notes = this.getStoredNotes()

    notes.forEach((note, index) => {
      if(note.id === id) {
        notes.splice(index, 1)
      }
    })

    localStorage.setItem('notes', JSON.stringify(notes))
  }

  return this
}

var noteStore = new NoteStore()