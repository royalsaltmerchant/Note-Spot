// dynamic render of note component
function Note(props) {
  // init Note 
  this.id = props.id
  this.color = props.color
  this.title = props.title ? props.title : ''
  this.text = props.text ? props.text : ''
  this.top = props.top
  this.left = props.left
  this.width = props.width
  this.height = props.height
  this.zIndex = props.zIndex
  this.tab = props.tab

  // store a hash of notes
  window.notes[this.id] = this

  this.render = function() {
    var section = document.createElement('section')
    // create and setup section
    this.section = section
    section.id = this.id
    section.style.top = `${this.top}px`
    section.style.left = `${this.left}px`
    section.style.width = `${this.width}px`
    section.style.height = `${this.height}px`
    section.style.zIndex = this.zIndex
    section.classList.add('resize')
    // keep current note on top
    section.addEventListener('mousedown', function(e) {
      e.stopPropagation()
      var notesArray = Object.values(window.notes)
      notesArray.forEach(function(note) {
        var noteElem = document.getElementById(note.id)
        if(section.id === noteElem.id) {
          section.style.zIndex = 2
          note.zIndex = 2
          note.saveNote()
        } else {
          noteElem.style.zIndex = 1
          note.zIndex = 1
          note.saveNote()
        }
      })
    }, true)
    // inside section
    var sectionBody = /*html*/ `
      <div class="draggable-header">
        <input onfocusout="var self = window.getNote(this); self.title = this.value; self.saveNote()" onmouseup="var self = window.getNote(this); self.title = this.value; self.saveNote()" id="title" placeholder="New Note" value="${this.title}">
        <button tabindex="-1" onclick="var self = window.getNote(this); self.removeNote(self, this.parentElement.parentElement)">✕</button>
      </div>
      <textarea onfocusout="var self = window.getNote(this); self.text = this.value; self.saveNote()" id="text" placeholder="Start Typing...">${this.text}</textarea>
    `
    // render to DOM and set color
    section.innerHTML = sectionBody
    section.children[0].style.backgroundColor = this.color
    document.querySelector('main').appendChild(section)

    // save note on resize
    var resizeObserver = new ResizeObserver(throttle(entries => {
      if(window.notes[this.section.id])
      this.saveNote()
    }, 100))
    resizeObserver.observe(this.section)
  }

  this.saveNote = function() {
    var newNote = props
    // set title, text, color
    newNote.title = this.title
    newNote.text = this.text
    newNote.color = this.color
    // set tab
    newNote.tab = this.tab
    // calculate location
    var elemRect = this.section.getBoundingClientRect()
    var mainRect = document.querySelector('main').getBoundingClientRect()
    var relativeTop = elemRect.top - mainRect.top
    newNote.top = relativeTop
    this.top = relativeTop
    newNote.left = elemRect.left
    this.left = elemRect.left
    newNote.zIndex = this.zIndex
    // calculate width and height
    newNote.width = this.section.offsetWidth
    this.width = this.section.offsetWidth
    newNote.height = this.section.offsetHeight
    this.height = this.section.offsetHeight
    // save to local storage
    var notes = noteStore.getStoredNotes()
    var isAlreadyNote = notes.some(note => note.id === newNote.id)
    if(!isAlreadyNote) noteStore.addNote(newNote)
    else noteStore.saveNote(newNote)
    // save to state
    window.notes[newNote.id] = this
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
  // check to see if there is a note already in start position recursively
  function getNewSpot(top, left) {
    var isInSpot = Object.values(window.notes).some(note => note.top === top && note.left === left)
    if(isInSpot) {
      top += 16
      left += 16
      getNewSpot(top, left)
    } else {
      // create new note
      var newNote = new Note({id: uuid.v4(), tab: currentTab, color: getRandomColor(), top: top, left: left})
      // place new note on top
      var notesArray = Object.values(window.notes)
      notesArray.forEach(function(note) {
        var noteElem = document.getElementById(note.id)
        if(newNote.id === noteElem.id) {
          noteElem.style.zIndex = 2
          note.zIndex = 2
          note.saveNote()
        } else {
          noteElem.style.zIndex = 1
          note.zIndex = 1
          note.saveNote()
        }
      })
      // focus on title of new note
      var newNoteElem = document.getElementById(newNote.id)
      newNoteElem.children[0].children[0].focus()
    }
  }

  var startTop = 8
  var startLeft = 8

  getNewSpot(startTop, startLeft)
}

function getSavedNotes() {
  // get notes from storage
  var notes = noteStore.getStoredNotes()

  if(notes.length === 0) {
    var newNote1 = new Note({id: uuid.v4(), tab: currentTab, color: '#0083C9', top: 8, left: 8})
    newNote1.saveNote()
  } else {
    notes.forEach(note => {
      new Note({
        id: note.id, 
        tab: note.tab ? note.tab : currentTab,
        color: note.color, 
        title: note.title, 
        text: note.text,
        top: note.top,
        left: note.left,
        width: note.width,
        height: note.height,
        zIndex: note.zIndex
      })
    })
  }
}

/// utility functions
function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function throttle(f, delay) {
  let timer = 0;
  return function(...args) {
      clearTimeout(timer);
      timer = setTimeout(() => f.apply(this, args), delay);
  }
}