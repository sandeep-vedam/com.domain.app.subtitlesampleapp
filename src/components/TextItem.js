import { Lightning, Subtitles } from 'Lightning-SDK'

export default class TextItem extends Lightning.Component {
  static _template() {
    return {
      Background: {
        h: 50,
        rect: true,
        color: 0x0039b54a,
        shader: { type: Lightning.shaders.RoundedRectangle, radius: 25 },
      },
      Label: {
        x: 20,
        y: 5,
        text: {
          text: '',
          textColor: 0xffffffff,
          fontSize: 30,
          lineHeight: 32,
          textAlign: 'center',
          verticalAlign: 'middle',
        },
      },
    }
  }

  _init() {
    this.tag('Label').on('txLoaded', () => {
      this.tag('Background').w = this.tag('Label').renderWidth + 40
      this.w = this.tag('Label').renderWidth + 40
      this.fireAncestors('$textItemsLoaded')
    })
    this._setState('Item')
  }

  set item(v) {
    this._label = v
    this.tag('Label').text.text = v
  }

  set index(v) {
    this._idx = v
  }

  get index() {
    return this._idx
  }

  set selected(v) {
    this._isSelected = v
    this.tag('Background').color = this._isSelected ? 0xff4d4d4d : 0x0039b54a
  }

  set paramToBeChanged(v) {
    this._paramToBeChanged = v
  }

  static get width() {
    return 150
  }
  static get height() {
    return 50
  }
  static _states() {
    return [
      class Item extends this {
        _focus() {
          this.tag('Background').color = 0xff39b54a
        }

        _unfocus() {
          this.tag('Background').color = this._isSelected ? 0xff4d4d4d : 0x0039b54a
        }
        _handleEnter() {
          this.fireAncestors('$setSelectedIndex', this._idx)
          switch (this._paramToBeChanged) {
            case 'Font Family':
              Subtitles.font(this._label)
              break
            case 'Position':
              Subtitles.alignment({
                mountY: this._label === 'Middle' ? 0.5 : this._label === 'Top' ? 0 : 1,
              })
              Subtitles.position({
                x: 960,
                y: this._label === 'Middle' ? 540 : this._label === 'Top' ? 90 : 990,
              })
          }
        }
      },
    ]
  }
}
