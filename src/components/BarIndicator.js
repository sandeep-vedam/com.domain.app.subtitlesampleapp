import { Lightning, Subtitles } from '@lightningjs/sdk'

export default class BarIndicator extends Lightning.Component {
  static _template() {
    return {
      y: 20,
      RectBar: {
        x: 0,
        y: 15,
        w: 383,
        Total: {
          texture: Lightning.Tools.getRoundRect(383, 8, 4),
          color: 0xff4d4d4d,
        },
        Active: { color: 0xff39b54a },
        Pointer: {
          alpha: 0,
          w: 6,
          h: 22,
          zIndex: 100,
          mountY: 0.3,
          texture: Lightning.Tools.getRoundRect(6, 22, 3, 0, 0x00f7f7f7, true, 0xfff7f7f7),
        },
      },
      Value: {
        x: 400,
        y: 5,
        text: {
          text: '0',
          textColor: 0xff616161,
          fontSize: 24,
          lineHeight: 28,
        },
      },
    }
  }

  _init() {
    this._progress = 0
    this._currentValue = 0
    this._totalValue = 100
    this.tag('Active').texture = {
      type: Lightning.textures.SourceTexture,
      textureSource: this.tag('Total').texture.source,
    }
    this._setState('Indicator')
  }

  set _progress(v) {
    const x = v * 383

    this.tag('Active').setSmooth('w', Math.max(x, 0.0001), {
      timingFunction: 'linear',
    })
    this.tag('RectBar.Pointer').setSmooth('x', Math.max(x, 0.0001), {
      timingFunction: 'linear',
    })
  }

  _toggleBarDirection(v) {
    v ? ++this._currentValue : --this._currentValue
    this._progress = this._currentValue / this._totalValue
    this.tag('Value').text.text = this._currentValue
    switch (this._paramToBeChanged) {
      case 'Font Size':
        Subtitles.txtSize(this._currentValue)
        break
      case 'Font Opacity':
        Subtitles.opacity(this._currentValue)
        break
      case 'Background Opacity':
        Subtitles.containerOpacity(this._currentValue)
        break
    }
  }

  set paramToBeChanged(v) {
    this._paramToBeChanged = v
  }

  static _states() {
    return [
      class Indicator extends this {
        _handleRight() {
          return false
        }

        _handleLeft() {
          return false
        }
        _handleEnter() {
          this._setState('ProgressPointer')
        }
        _focus() {
          this.tag('Total').color = 0xff101010
          this.tag('Value').text.textColor = 0xff101010
        }

        _unfocus() {
          this.tag('Total').color = 0xff4d4d4d
          this.tag('Value').text.textColor = 0xff616161
        }
      },
      class ProgressPointer extends this {
        $enter() {
          this.tag('Pointer').alpha = 1
        }
        _handleRight() {
          if (this._currentValue < this._totalValue) {
            this._toggleBarDirection(true)
          } else {
            return false
          }
        }

        _handleLeft() {
          if (this._currentValue > 0) {
            this._toggleBarDirection(false)
          } else {
            return false
          }
        }

        _unfocus() {
          this._setState('Indicator')
          this.tag('Pointer').alpha = 0
        }
      },
    ]
  }
}
