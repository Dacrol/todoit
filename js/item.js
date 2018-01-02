class Item {
  constructor(container, title, body) {
    this.title = title
    this.body = body
    this.archived = false
  }

  get template() {
    const template =
    `
    <div class="list-item">
      <div class="list-item-content">
        <span>${this.title ? this.title : ''}</span>${this.body ? this.body : ''}
      </div>
    </div>
    `
    return template
  }
}

// itemGrids[0].refreshItems().layout()
