var noteCount = 1

window.getNote = function(elem) {
  var id = elem.closest('section').id
  return window.notes[id]
}

// dynamic render of note component
function Note(props) {
  this.id = props.id
  this.title = ''
  this.text = ''

  var self = this

  // store a hash of notes
  if(!window.notes) window.notes = {}
  window.notes[this.id] = this

  this.render = function() {
    var section = document.createElement('section')
    section.id = this.id
    section.classList.add('resize')
    section.addEventListener('mousedown', function(e) {
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
        <input onfocusout="var self = window.getNote(this); self.title = this.value;" id="title" placeholder="New Note">
        <button onclick="var self = window.getNote(this); self.removeNote(this.parentElement.parentElement)">✕</button>
      </div>
      <textarea onfocusout="var self = window.getNote(this); self.text = this.value;" id="text" placeholder="Start Typing...">${this.text}</textarea>
    `
    section.innerHTML = sectionBody
    if(props.color) section.children[0].style.backgroundColor = props.color
    document.querySelector('main').appendChild(section)
  }
  
  this.removeNote = function(noteSection) {
    if(window.confirm(`Are you sure you want to delete note: "${this.title}"`)) noteSection.remove()
  }

  this.render()
  return this
}

new Note({id: `note-${noteCount}`})

function newNote() {
  noteCount++
  new Note({id: `note-${noteCount}`, color: getRandomColor()})
}


function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}