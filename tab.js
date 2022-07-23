var currentTab = ''

function Tab(props) {
  var self = this
  this.id = props.id
  this.title = props.title

  // store a hash of tabs
  if(!window.tabs) window.tabs = {}
  window.tabs[this.id] = this

  this.render = function() {
    // get tab container
    var tabContainerElem = document.getElementById('tab-container')

    // create main tab div
    var tabDiv = document.createElement('div')
    tabDiv.classList.add('tab')
    tabDiv.id = this.id
    tabDiv.addEventListener('mouseup', function(event) {
      if(event.target.tagName === "BUTTON") return
      highlightTab(self.id, false)
    })

    // tab input
    var tabInput = document.createElement('input')
    tabInput.placeholder = 'New Tab'
    tabInput.value = this.title
    tabInput.addEventListener('focusout', function() {
      self.title = tabInput.value
      self.saveTab()
    })

    // tab remove button
    var tabRemoveButton = document.createElement('button')
    tabRemoveButton.innerText = '✕'
    tabRemoveButton.addEventListener('mouseup', function() {
      var allTabs = Object.values(window.tabs)
      if(allTabs.length > 1) {
        if(window.confirm(`Are you sure you want to delete tab: "${self.title}"`)) {
          // highlight another tab
          var previousTab = tabDiv.previousElementSibling
          var nextTab = tabDiv.nextElementSibling
          if(previousTab) highlightTab(previousTab.id, false)
          else if(newTab) highlightTab(nextTab.id, false)
          // remove all associated notes
          var allNotes = Object.values(window.notes)
          allNotes.forEach(note => {
            if(note.tab === self.id) {
              noteStore.removeNote(note.id)
            }
          })
          // remove tab from store and DOM
          delete window.tabs[tabDiv.id]
          tabDiv.remove()
          tabStore.removeTab(self.id)
        }
      }
    })
    
    // append to DOM
    tabDiv.appendChild(tabInput)
    tabDiv.appendChild(tabRemoveButton)
    tabContainerElem.insertBefore(tabDiv, document.getElementById('new-tab-btn'))
  }

  this.saveTab = function() {
    // save to local storage
    var tabs = tabStore.getStoredTabs()
    var isAlreadyTab = tabs.some(tab => tab.id === self.id)
    if(!isAlreadyTab) tabStore.addTab(self)
    else tabStore.saveTab(self)
  }

  this.render()
  return this
}

function newTab(focus) {
  var newTab = new Tab({id: uuid.v4(), title: ''})
  newTab.saveTab()
  highlightTab(newTab.id, focus)
}

function getSavedTabs() {
  // get saved
  var tabs = tabStore.getStoredTabs()
  if(tabs.length === 0) {
    newTab(false)
  } else {
    tabs.forEach(tab => {
      new Tab({id: tab.id, title: tab.title})
    })
    highlightTab(tabs[0].id, false)
  }
}

function highlightTab(tabToHighlightId, focus) {
  // set current tab to this
  currentTab = tabToHighlightId

  // set current tab on top and others below on click
  var allTabs = Object.values(window.tabs)
  allTabs.forEach(tab => {
    var tabElem = document.getElementById(tab.id)
    if(tab.id === tabToHighlightId) {
      tabElem.setAttribute('style', 'border-bottom: 0px')
      if(focus) tabElem.children[0].focus()
    } else tabElem.setAttribute('style', 'border-bottom: 1px solid var(--second-gray)')
  })

  setTimeout(() => {
    var allNotes = Object.values(window.notes)
    allNotes.forEach(note => {
      if(note.tab === currentTab) document.getElementById(note.id).style.visibility = 'visible'
      else document.getElementById(note.id).style.visibility = 'hidden'
    })
  }, 20)
}

getSavedTabs()