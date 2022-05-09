  var noteCount = 1

  window.getNote = function(elem) {
    var id = elem.closest('.note-block').id
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
      section.classList.add('note-block')
      section.classList.add('resize')
      var sectionBody = /*html*/ `
        <div class="draggable-header">
          <input onfocusout="var self = window.getNote(this); self.title = this.value;" id="title" placeholder="New Note">
        </div>
        <textarea onfocusout="var self = window.getNote(this); self.text = this.value;" id="text" placeholder="Start Typing...">${this.text}</textarea>
      `
      section.innerHTML = sectionBody
      document.querySelector('main').appendChild(section)
    }

    // this.toggleEdit = function(section) {
    //   if(!this.edit) {
    //     this.edit = true

    //     var sectionBody = /*html*/ `
    //       <form class="draggable-header">
    //         <input placeholder="Title..." value="${this.title}">
    //         <button type="submit" tabindex="-1" onclick="var self = window.getNote(this); self.toggleEdit(this.parentElement.parentElement)">Done</button>
    //       </form>
    //       <textarea placeholder="Start Typing...">${this.text}</textarea>
    //     `
    //     section.innerHTML = sectionBody
    //     section.children[0].children[0].focus()
    //   } else {
    //     this.edit = false
    //     this.title = section.children[0].children[0].value
    //     // this.text = section.children[1].value

    //     var sectionBody = /*html*/ `
    //     <div class="draggable-header">
    //       <p>${this.title}</p>
    //       <button onclick="var self = window.getNote(this); self.toggleEdit(this.parentElement.parentElement)">Edit</button>
    //     </div>
    //     <textarea placeholder="Start Typing...">${this.text}</textarea>
    //   `
    //   section.innerHTML = sectionBody
    //   }
    // }

    this.render()
    return this
  }

  new Note({id: `note-${noteCount}`})

  function newNote() {
    noteCount++
    new Note({id: `note-${noteCount}`})
  }