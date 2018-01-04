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

function saveAllItems () {
  localStorage.setItem('items', JSON.stringify(itemsToArray()))
}

function loadAllItems () {
  const items = localStorage.getItem('items')
  restoreItems(JSON.parse(items), itemGrids)
}

function restoreItems (items, itemGrids) {
  items.forEach((i) => {
    let item = new Item(i.gridIndex, i.index, i.body)
    let newGridItem = itemGrids[item.gridIndex].add($(item.template).get(), {index: item.index})
    $(newGridItem[0].getElement()).data('item', item)
  })
  refreshEventHandlers()
  itemGrids.forEach((grid) => { grid.show() })
}
