var noteCount = 1

window.getNote = function(elem) {
  var id = elem.closest('section').id
  return window.notes[id]
}

// dynamic render of note component
function Note(props) {
  this.id = props.id
  this.color = props.color
  this.title = props.title ? props.title : ''
  this.text = props.text ? props.text : ''
  this.top = props.top
  this.left = props.left
  this.element;

  // store a hash of notes
  if(!window.notes) window.notes = {}
  window.notes[this.id] = this

  this.render = function() {
    var section = document.createElement('section')
    this.section = section
    section.id = this.id
    section.style.top = `${this.top}px`
    section.style.left = `${this.left}px`
    section.classList.add('resize')
    section.addEventListener('mousedown', function(e) {
      e.stopPropagation()
      var notesArray = Object.values(window.notes)
      notesArray.forEach(function(note) {
        var noteElem = document.getElementById(note.id)
        if(section.id === noteElem.id) {
          section.style.zIndex = 2
        } else noteElem.style.zIndex = 1
      })
    }, true)
    
    var sectionBody = /*html*/ `
      <div class="draggable-header">
        <input onfocusout="var self = window.getNote(this); self.title = this.value; self.saveNote()" onmouseup="var self = window.getNote(this); self.title = this.value; self.saveNote()" id="title" placeholder="New Note" value="${this.title}">
        <button onclick="var self = window.getNote(this); self.removeNote(self, this.parentElement.parentElement)">✕</button>
      </div>
      <textarea onfocusout="var self = window.getNote(this); self.text = this.value; self.saveNote()" id="text" placeholder="Start Typing...">${this.text}</textarea>
    `
    section.innerHTML = sectionBody
    section.children[0].style.backgroundColor = this.color
    document.querySelector('main').appendChild(section)
  }

  this.saveNote = function() {
    var newNote = props
    newNote.title = this.title
    newNote.text = this.text
    newNote.color = this.color

    var elemRect = this.section.getBoundingClientRect()
    var mainRect = document.querySelector('main').getBoundingClientRect()
    newNote.top = elemRect.top - mainRect.top
    newNote.left = elemRect.left

    var notes = noteStore.getStoredNotes()
    var isAlreadyNote = notes.some(note => note.id === newNote.id)
    if(!isAlreadyNote) noteStore.addNote(newNote)
    else noteStore.saveNote(newNote)
  }
  
  this.removeNote = function(self, noteSection) {
    if(window.confirm(`Are you sure you want to delete note: "${this.title}"`)) {
      noteStore.removeNote(noteSection.id)
      noteSection.remove()
      delete window.notes[self.id]
    }
  }

  this.render()
  return this
}

function newNote() {
  noteCount++
  new Note({id: `note-${noteCount}`, color: getRandomColor()})
}

function getSavedNotes() {
  var notes = noteStore.getStoredNotes()
  if(notes.length === 0) {
    new Note({id: `note-${noteCount}`, color: '#0083C9'})
  } else {
    var ids = []
    notes.forEach(note => {
      new Note({
        id: note.id, 
        color: note.color, 
        title: note.title, 
        text: note.text,
        top: note.top,
        left: note.left
      })
      var noteIdAsNumber = parseInt(note.id.split('-')[1])
      ids.push(noteIdAsNumber)
    })

    var latestId = ids.sort()
    noteCount = latestId[latestId.length - 1]
  }
}

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

getSavedNotes()