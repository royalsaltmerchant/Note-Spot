  var noteCount = 1

  window.getNote = function(elem) {
    var id = elem.closest('.note-block').id
    return window.notes[id]
  }
  
  // dynamic render of note component
  function Note(props) {
    this.id = props.id
    this.title = `Note ${noteCount}`
    this.text = 'Text...'

    // store a hash of notes
    if(!window.notes) window.notes = {}
    window.notes[this.id] = this

    this.render = function() {
      var section = document.createElement('section')
      
      section.id = this.id
      section.classList.add('note-block')
      section.classList.add('resize-drag')
      var sectionBody = /*html*/ `
        <div class="draggable-header">
          <p>${this.title}</p>
          <button onclick="var self = window.getNote(this); self.toggleEdit(this.parentElement.parentElement)">Edit</button>
        </div>
        <p>${this.text}</p>
      `
      section.innerHTML = sectionBody
      document.querySelector('main').appendChild(section)
    }

    this.toggleEdit = function(section) {
      if(!this.edit) {
        this.edit = true

        section.classList.remove('resize-drag')

        var sectionBody = /*html*/ `
          <div class="draggable-header">
            <input placeholder="Title..." value="${this.title}">
            <button onclick="var self = window.getNote(this); self.toggleEdit(this.parentElement.parentElement)">Done</button>
          </div>
          <textarea placeholder="Start Typing...">${this.text}</textarea>
        `
        section.innerHTML = sectionBody
      } else {
        this.edit = false
        this.title = section.children[0].children[0].value
        this.text = section.children[1].value

        section.classList.add('resize-drag')
        var sectionBody = /*html*/ `
        <div class="draggable-header">
          <p>${this.title}</p>
          <button onclick="var self = window.getNote(this); self.toggleEdit(this.parentElement.parentElement)">Edit</button>
        </div>
        <p>${this.text}</p>
      `
      section.innerHTML = sectionBody
      }
    }

    this.render()
    return this
  }

  new Note({id: `note-${noteCount}`})

  function newNote() {
    noteCount++
    new Note({id: `note-${noteCount}`})
  }