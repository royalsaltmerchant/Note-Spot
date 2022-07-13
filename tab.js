var currentTab = 0
var tabList = []

function Tab(props) {
  this.id = props.id

  var tabContainerElem = document.getElementById('tab-container')
  var tabDiv = document.createElement('div')
  tabDiv.classList.add('tab')
  var tabInput = document.createElement('input')
  tabInput.placeholder = 'New Tab'
  var tabRemoveButton = document.createElement('button')
  tabRemoveButton.innerText = '✕'

  tabDiv.appendChild(tabInput)
  tabDiv.appendChild(tabRemoveButton)

  tabContainerElem.prepend(tabDiv)
  return this
}

function newTab() {
  var newTab = new Tab({id: uuid.v4()})
}

function getSavedTabs() {
  // get saved
  var tabs = []
  if(tabs.length === 0) {
    newTab()
  } else {

  }
}

getSavedTabs()