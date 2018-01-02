// Setup Muuri

const listsGrid = new Muuri('.lists', {
  layoutDuration: 400,
  layoutEasing: 'ease',
  dragEnabled: true,
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
