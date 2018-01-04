class Item {
  constructor (containerID, index, body) {
    this.body = body
    this.archived = false
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
}
