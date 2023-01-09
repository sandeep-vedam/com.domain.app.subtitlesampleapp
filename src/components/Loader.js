import { Lightning, Utils } from 'Lightning-SDK'

export default class Loader extends Lightning.Component {
  static _template() {
    return {
      Wrapper: {
        src: Utils.asset('images/loader.png'),
      },
    }
  }

  set color(loaderColor) {
    this.tag('Wrapper').patch({
      color: loaderColor,
    })
  }

  _setup() {
    this._loader = this.tag('Wrapper').animation({
      duration: 4,
      repeat: -1,
      stopMethod: 'fade',
      actions: [{ p: 'rotation', v: { 0: { v: 0, sm: 0 }, 1: { v: 2 * Math.PI, sm: 0 } } }],
    })
  }

  _active() {
    this._loader.start()
  }

  _inactive() {
    this._loader.stop()
  }
}
