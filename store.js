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

function TabStore() {
  this.getStoredTabs = function() {
    var tabs;

    if(localStorage.getItem('tabs') === null) {
      tabs = []
    } else {
      tabs = JSON.parse(localStorage.getItem('tabs'))
    }

    return tabs
  }

  this.addTab = function(tab) {
    var tabs = this.getStoredTabs()
    tabs.push(tab)
    localStorage.setItem('tabs', JSON.stringify(tabs))
  }

  this.saveTab = function(tabToSave) {
    var tabs = this.getStoredTabs()

    var tabIndex = tabs.findIndex(tab => tabToSave.id === tab.id)
    tabs[tabIndex] = tabToSave

    localStorage.setItem('tabs', JSON.stringify(tabs))
  }

  this.removeTab = function(id) {
    var tabs = this.getStoredTabs()

    tabs.forEach((tab, index) => {
      if(tab.id === id) {
        tabs.splice(index, 1)
      }
    })

    localStorage.setItem('tabs', JSON.stringify(tabs))
  }

  return this
}

var tabStore = new TabStore()