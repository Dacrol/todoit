
class List extends Muuri {
  constructor (container, itemGrids, listsGrid) {
    const options = {
      items: '.list-item',
      layoutDuration: 400,
      layoutEasing: 'ease',
      dragEnabled: true,
      dragSort: function () {
        return itemGrids
      },
      dragSortInterval: 0,
      dragContainer: document.body,
      dragReleaseDuration: 400,
      dragReleaseEasing: 'ease',
      dragStartPredicate: {distance: 0, delay: 0, handle: '.list-item:not(.frozen)'}
    }
    super(container, options)

    this.on('dragStart', function (item) {
      item.getElement().style.width = item.getWidth() + 'px'
      item.getElement().style.height = item.getHeight() + 'px'
    })
      .on('dragReleaseEnd', function (item) {
        item.getElement().style.width = ''
        item.getElement().style.height = ''
        itemGrids.forEach(function (grid) {
          grid.refreshItems()
        })
      })
      .on('layoutStart', function () {
        listsGrid.refreshItems().layout()
      })
    // itemGrids.push(this)
  }
}
