import { Lightning } from '@lightningjs/sdk'
import { List } from '@lightningjs/ui'

export default class Tile extends Lightning.Component {
  static _template() {
    return {
      Bg: {
        alpha: 0,
        w: 480,
        h: 150,
        rect: true,
        color: 0xff4d4d4d,
      },
      Label: {
        x: 10,
        y: 10,
        text: {
          text: '',
          textColor: 0xff999999,
          fontSize: 30,
          lineHeight: 32,
        },
      },
      ItemsList: {
        x: 20,
        w: 460,
        h: 100,
        clipping: true,
        type: List,
        direction: 'row',
        signals: { onIndexChanged: true },
      },
    }
  }

  set label(v) {
    this._label = v
    this.tag('Label').text.text = v
  }

  set itemType(v) {
    this._itemType = v
  }

  set items(v) {
    this._items = v
    if (this._items.length) {
      let items = this._items.map((item, index) => {
        return {
          type: this._itemType,
          item: item,
          paramToBeChanged: this._label,
          index: index,
        }
      })
      this.tag('ItemsList').addAt(items, 0)
    } else {
      this.tag('ItemsList').addAt({ type: this._itemType, paramToBeChanged: this._label }, 0)
    }
  }

  _init() {
    this.tag('Label').on('txLoaded', () => {
      this.tag('ItemsList').y = this.tag('Label').y + this.tag('Label').renderHeight
    })
    this._setState('List')
  }

  $textItemsLoaded() {
    this.tag('ItemsList').repositionItems()
  }

  $setSelectedIndex(idx) {
    this.tag('ItemsList').items.forEach((item, index) => {
      item.selected = index === idx
    })
  }
  static get height() {
    return 150
  }

  _toggleFocus(v) {
    this.tag('Label').text.textColor = v ? 0xffffffff : 0xff999999
    this.tag('Bg').alpha = v ? 1 : 0
  }

  _focus() {
    this._toggleFocus(true)
  }

  _unfocus() {
    this._toggleFocus(false)
  }

  static _states() {
    return [
      class List extends this {
        _getFocused() {
          return this.tag('ItemsList')
        }
      },
    ]
  }
}
