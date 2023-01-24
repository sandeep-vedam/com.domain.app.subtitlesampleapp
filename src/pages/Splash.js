import { Lightning, Router, Utils } from '@lightningjs/sdk'

export default class Splash extends Lightning.Component {
  static _template() {
    return {
      StartButton: {
        mount: 0.5,
        x: 960,
        y: 800,
        w: 200,
        h: 50,
        color: 0xffff0000,
        rect: true,
        Text: {
          text: {
            text: 'Start',
            textAlign: 'center',
          },
        },
      },
    }
  }

  _handleEnter() {
    Router.navigate('player')
  }
}
