
// Setup Muuri

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

function restoreArchivedItem () {
  if (archivedItems.length > 0) {
    let restoredItem = archivedItems.shift()
    restoredItem.archived = false
    Item.restoreItems(restoredItem, itemGrids)
  }
}

function showOrHideRestoreButton () {
  if (archivedItems.length > 0) {
    $('.restore').fadeIn(200)
  } else {
    $('.restore').fadeOut(400)
  }
}

// TODO: Only run once per item (works fine without it though)
/**
 * Refresh the event handlers for all list-items
 */
function refreshEventHandlers () {
  $('.list-item-content').each(function () { this.addEventListener('input', () => { refreshAllGrids() }) })

  $('.delete').click(function () {
    let item = $(this).parent().data('item')
    console.log(item)
    if (item) {
      item.archived = true
      archivedItems.push(item)
      localStorage.setItem('archivedItems', JSON.stringify(archivedItems))
      itemGrids.forEach((grid) => {
        grid.remove($(this).parent()[0])
      })
      $(this).parent().remove()
    }
  })

  $('.list-item').click(function () {
    $(this).addClass('frozen')
    $(this).children().first().focus()
    if (!editing) {
      selectEndOfNode($(this).children().first().get()[0])
    }
    editing = true
  })

  $('.list-item').mousedown(function (event) {
    // console.log($(this))
    if (!$(this).hasClass('frozen')) {
      event.preventDefault()
      if (editing) {
        $('.frozen').each(function () { $(this).children().first().blur() })
        editing = false
      }
    }
  })

  $('.list-item').hover(function () {
    console.log($(this))
    $(this).children('.delete').fadeIn(200)
  }, function () {
    if (!$(this).hasClass('frozen')) {
      $(this).children('.delete').fadeOut(200)
    }
  })

  $('.list-item-content').focusout(function () {
    if (editing) {
      setTimeout(() => {
        $(this).parent().removeClass('frozen')
      }, 250) // Add a delay to have time to register clicks on .frozen > .delete
      $('.delete').fadeOut(400)
      // $(this).parent().removeClass('frozen')
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
  }).focus(function () {
    $(this).parent().children('.delete').fadeIn(200)
    // console.log($(this))
  })
}
