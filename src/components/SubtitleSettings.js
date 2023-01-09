import { Lightning } from 'Lightning-SDK'
import TextItem from './TextItem'
import BarIndicator from './BarIndicator'
import ColorItem from './ColorItem'
import Tile from './Tile'
import { List } from '@lightningjs/ui'

export default class SubtitleSettings extends Lightning.Component {
  static _template() {
    return {
      Container: {
        FontContainer: {
          w: 480,
          h: 1080,
          rect: true,
          color: 0xff171717,
          Title: {
            x: 30,
            y: 32,
            text: {
              text: 'Subtitle Styling',
              textAlign: 'left',
              textColor: 0xffcccccc,
              lineHeight: 44,
              fontSize: 40,
              letterSpacing: 0.2,
            },
          },
          StyleList: {
            y: 107,
            w: 480,
            h: 950,
            clipping: true,
            type: List,
            direction: 'column',
            signals: { onIndexChanged: true },
          },
        },
      },
    }
  }

  _init() {
    this.items = { tag: 'StyleList', options: SubtitleSettings.STYLINGSETTINGS }
    this._setState('StyleSettings')
  }

  set items({ tag, options }) {
    this.tag(tag).addAt(
      options.map((item, index) => {
        return {
          type: Tile,
          label: item.style,
          itemType: item.itemType,
          items: item.options ? item.options : [],
        }
      }),
      0,
    )
  }
  static _states() {
    return [
      class StyleSettings extends this {
        _getFocused() {
          return this.tag('StyleList')
        }
      },
    ]
  }
}
SubtitleSettings.STYLINGSETTINGS = [
  {
    style: 'Font Family',
    options: ['Roboto', 'Graphik', 'Liberator', 'Italic', 'Roman'],
    itemType: TextItem,
  },
  { style: 'Font Size', itemType: BarIndicator },
  {
    style: 'Font Color',
    options: [0xff603141, 0xff000000, 0xffffffff, 0xff009900, 0xff0e536a],
    itemType: ColorItem,
  },
  { style: 'Font Opacity', itemType: BarIndicator },
  // {style: 'Edge Type', options:['Inline', 'Shadow', 'Outline'], itemType: TextItem},
  // {style: 'Edge Color', options:[0xff603141,0xff000000, 0xffffffff, 0xff009900, 0xff0E536A], itemType:ColorItem },
  { style: 'Background Opacity', itemType: BarIndicator },
  {
    style: 'Background Color',
    options: [0xff603141, 0xff000000, 0xffffffff, 0xff009900, 0xff0e536a],
    itemType: ColorItem,
  },
  // {style: 'Font Opacity', itemType: BarIndicator},
  { style: 'Position', options: ['Top', 'Middle', 'Bottom'], itemType: TextItem },
]
