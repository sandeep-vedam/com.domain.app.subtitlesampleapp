import { Lightning, Subtitles } from 'Lightning-SDK'

export default class ColorItem extends Lightning.Component {
  static _template() {
    return {
      y: 5,
      Background: {
        alpha: 1,
        w: 70,
        h: 70,
        rect: true,
        shader: {
          type: Lightning.shaders.RoundedRectangle,
          radius: 35,
          stroke: 10,
          strokeColor: 0x004d4d4d,
          fillColor: 0xffcb0000,
        },
      },
    }
  }

  set item(v) {
    this._color = v
    this.tag('Background').shader.fillColor = v
  }

  _init() {
    this._setState('Item')
  }

  set selected(v) {
    this._isSelected = v
    this.tag('Background').shader.strokeColor = this._isSelected ? 0xff4d4d4d : 0x004d4d4d
  }
  set index(v) {
    this._idx = v
  }

  get index() {
    return this._idx
  }

  set paramToBeChanged(v) {
    this._paramToBeChanged = v
  }

  static get width() {
    return 100
  }
  static get height() {
    return 120
  }

  static _states() {
    return [
      class Item extends this {
        _handleEnter() {
          this.fireAncestors('$setSelectedIndex', this._idx)
          switch (this._paramToBeChanged) {
            case 'Font Color':
              Subtitles.color(this._color)
              break
            case 'Background Color':
              Subtitles.background(this._color)
          }
        }
        _focus() {
          this.tag('Background').shader.strokeColor = 0xff39b54a
        }

        _unfocus() {
          this.tag('Background').shader.strokeColor = this._isSelected ? 0xff4d4d4d : 0x004d4d4d
        }
      },
    ]
  }
}
