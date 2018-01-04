
// Setup grids
const listsGrid = List.createListsGrid()
const itemGrids = [];
[].push.apply(itemGrids, $('.list-column-content').get().map((container) => {
  return new List(container, itemGrids, listsGrid)
}))

const archivedItems = JSON.parse(localStorage.getItem('archivedItems')) || []

var editing = false

$(document).ready(function () {
  loadAllItems()
  refreshEventHandlers()
  showOrHideRestoreButton()
})

$('.restore').click(function () {
  restoreArchivedItem()
})

$('.new-item').children().click(function () {
  const parentGridIndex = listsGrid.getItems($(this).closest('.list-column').get())[0]._id - itemGrids.length
  createNewItem(parentGridIndex)
})

$(document).keypress(function (event) {
  const target = $(event.target)
  if (target.hasClass('list-item-content') && event.keyCode === 13 && !(event.shiftKey || event.ctrlKey || event.altKey || event.metaKey)) {
    target.blur()
    event.preventDefault()
  }
})
