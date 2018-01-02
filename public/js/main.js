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
})

const itemGrids = [];
[].push.apply(itemGrids, $('.list-column-content').get().map((container) => {
  return new List(container, itemGrids, listsGrid)
}))

var editing = false

$('.list-item-content').each(function () { this.addEventListener('input', () => { itemGrids.forEach((grid) => { grid.refreshItems().layout() }) }) })

$('.list-item').click(function () {
  $(this).addClass('frozen')
  $(this).children().first().focus()
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
    console.log($(this))
    $(this).parent().removeClass('frozen')
    clearSelect()
    editing = false
  }
})

/**
 * Clears any selections
 */
function clearSelect () {
  if (window.getSelection) {
    window.getSelection().removeAllRanges()
  } else if (document.selection) {
    document.selection.empty()
  }
}
