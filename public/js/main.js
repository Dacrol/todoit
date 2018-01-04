
// Setup Muuri

const listsGrid = new Muuri('.lists', {
  layoutDuration: 400,
  layoutEasing: 'ease',
  dragEnabled: true, // Set false to disable dragging todo-lists
  dragSort: true,
  dragSortInterval: 0,
  dragStartPredicate: {
    handle: '.list-column-header'
  },
  dragReleaseDuration: 600,
  dragReleaseEasing: 'ease'
}).on('layoutEnd', () => {
  if (!editing) {
    saveAllItems()
    // console.log(itemsToArray())
  }
})

const itemGrids = [];
[].push.apply(itemGrids, $('.list-column-content').get().map((container) => {
  return new List(container, itemGrids, listsGrid)
}))

var editing = false
refreshEventHandlers()
$(document).ready(function () {
  loadAllItems()
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

/**
 * Creates a new item in the selected itemGrid
 */
function createNewItem (gridNo) {
  let newItem = new Item(gridNo, 0)
  let newGridItem = itemGrids[gridNo].add($((newItem).template).css({display: 'none'}).get(), {index: 0})
  itemGrids[gridNo].show(newGridItem)
  $(newGridItem[0].getElement()).data('item', newItem)
  refreshEventHandlers()
  $(newGridItem[0]._child).focus()
  editing = true
}

// TODO: Only run once per item
/**
 * Refresh the event handlers for all list-items
 */
function refreshEventHandlers () {
  $('.list-item-content').each(function () { this.addEventListener('input', () => { refreshAllGrids() }) })

  $('.list-item').click(function () {
    $(this).addClass('frozen')
    $(this).children().first().focus()
    if (!editing) {
      selectEndOfNode($(this).children().first().get()[0])
    }
    editing = true
  })

  $('.list-item').mousedown(function (event) {
    if (!$(this).hasClass('frozen')) {
      event.preventDefault()
      if (editing) {
        $('.frozen').each(function () { $(this).children().first().blur() })
        editing = false
      }
    }
  })

  $('.list-item-content').focusout(function () {
    if (editing) {
      $(this).parent().removeClass('frozen')
      clearSelect()
      editing = false
      if (!(/\w/.test($(this).text()))) {
        itemGrids.forEach((grid) => {
          grid.remove($(this).parent()[0])
        })
        $(this).parent().remove()
      }
    }
    if (!editing) {
      saveAllItems()
      // console.log(itemsToArray())
    }
  })
}

/**
 * Clears any selections
 */
function clearSelect () {
  if (window.getSelection) {
    window.getSelection().removeAllRanges()
  // @ts-ignore
  } else if (document.selection) {
    // @ts-ignore
    document.selection.empty()
  }
}
/**
 * Places the cursor at the end of an element
 *
 * @param {object} node The HTML element to select end of
 */
function selectEndOfNode (node) {
  const range = document.createRange()
  range.selectNodeContents(node)
  range.collapse(false)
  const select = window.getSelection()
  select.removeAllRanges()
  select.addRange(range)
}
/**
 * Refreshes the layout of all grids
 */
function refreshAllGrids () {
  itemGrids.forEach((grid) => { grid.refreshItems().layout() })
}

