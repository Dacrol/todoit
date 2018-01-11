class Item {
  constructor (gridIndex, index, body) {
    this.body = body
    this.archived = false
    this.gridIndex = gridIndex
    this.index = index
  }

  get template () {
    const template =
    `
    <div class="list-item">

      <div contenteditable="true" class="list-item-content"><span class="item-body">${this.body ? this.body : '\u200B'}</span>

      </div>
      <span contenteditable="false" class="delete"></span>
    </div>
    `
    return template
  }

  set position (pos) {
    if (Array.isArray(pos)) {
      this.gridIndex = pos[0]
      this.index = pos[1]
    } else {
      throw new Error('Position must be an array')
    }
  }

  /**
 * Update index of each item in every grid

 * @static
 * @param {Array.<List>} grids Array of lists
 * @memberof Item
 */
  static updateIndices (grids) {
    grids.forEach((grid, gridIndex) => {
      grid.getItems().forEach((item, itemIndex) => {
        let itemInstance = $(item.getElement()).data('item')
        if (typeof itemInstance !== 'undefined') {
          itemInstance.position = [gridIndex, itemIndex]
        }
      })
    })
  }
  static restoreItems (items, grids = itemGrids) {
    let singleItem = false
    if (!Array.isArray(items)) {
      items = [items]
      singleItem = true
    }
    items.sort((a, b) => { return a.index - b.index })
    items.forEach((i) => {
      let item = new Item(i.gridIndex, i.index, i.body)

      let newGridItem = grids[item.gridIndex].add(
        singleItem
          ? $(item.template).css({display: 'none'}).get()
          : $(item.template).get(),
        {index: item.index}
      )
      $(newGridItem[0].getElement()).data('item', item)
    })
    refreshEventHandlers()
    grids.forEach((grid) => { grid.show() })
  }
}

function itemsToArray () {
  let arr = []
  $('.list-item').each(function () {
    let itemInstance = $(this).data('item')
    if (typeof itemInstance !== 'undefined') {
      itemInstance.body = $(this).children('.list-item-content').text().trim()
      arr.push(itemInstance)
    }
  })
  return arr
}

// Global functions:

function saveAllItems () {
  localStorage.setItem('items', JSON.stringify(itemsToArray()))
}

function loadAllItems () {
  const items = localStorage.getItem('items')
  if (items) {
    Item.restoreItems(JSON.parse(items), itemGrids)
  }
}

function clearStorage () {
  localStorage.removeItem('items')
  localStorage.removeItem('archivedItems')
}


/**
 * Creates a new item in the selected itemGrid
 */

function createNewItem (gridNo) {
  let newItem = new Item(gridNo, 0)
  let newGridItem = itemGrids[gridNo].add($((newItem).template).css({display: 'none'}).addClass('frozen').get(), {index: 0})
  itemGrids[gridNo].show(newGridItem)
  $(newGridItem[0].getElement()).data('item', newItem)
  refreshEventHandlers()
  setTimeout(() => {
    $(newGridItem[0]._child).focus()
  }, 400)
  editing = true
}
