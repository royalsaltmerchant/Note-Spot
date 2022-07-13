var currentTab = ''

function Tab(props) {
  var self = this
  this.id = props.id
  this.title = ''

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
    tabInput.addEventListener('focusout', function() {
      self.title = tabInput.value
    })

    // tab remove button
    var tabRemoveButton = document.createElement('button')
    tabRemoveButton.innerText = '✕'
    tabRemoveButton.addEventListener('mouseup', function() {
      var allTabs = Object.values(window.tabs)
      if(allTabs.length > 1) {
        if(window.confirm(`Are you sure you want to delete tab: "${self.title}"`)) {
          var previousTab = tabDiv.previousElementSibling
          highlightTab(previousTab.id, false)
          delete window.tabs[tabDiv.id]
          tabDiv.remove()
        }
      }
    })
    
    // append to DOM
    tabDiv.appendChild(tabInput)
    tabDiv.appendChild(tabRemoveButton)
    tabContainerElem.insertBefore(tabDiv, document.getElementById('new-tab-btn'))
  }

  this.render()
  return this
}

function newTab(focus) {
  var newTab = new Tab({id: uuid.v4()})
  highlightTab(newTab.id, focus)
}

function getSavedTabs() {
  // get saved
  var tabs = []
  if(tabs.length === 0) {
    newTab(false)
  } else {

  }
}

function highlightTab(tabToHighlightId, focus) {
  // set current tab to this
  currentTab = newTab.id

  // set current tab on top and others below on click
  var allTabs = Object.values(window.tabs)
  allTabs.forEach(tab => {
    var tabElem = document.getElementById(tab.id)
    if(tab.id === tabToHighlightId) {
      tabElem.setAttribute('style', 'border-bottom: 0px')
      if(focus) tabElem.children[0].focus()
    } else tabElem.setAttribute('style', 'border-bottom: 1px solid var(--second-gray)')
  })
}

getSavedTabs()