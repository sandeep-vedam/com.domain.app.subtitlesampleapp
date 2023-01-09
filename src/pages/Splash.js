import { Lightning, Router, Utils } from 'Lightning-SDK'

export default class Splash extends Lightning.Component {
  static _template() {
    return {
      Background: {
        w: 1920,
        h: 1080,
        color: 0xfffbb03b,
        src: Utils.asset('images/background.png'),
      },
      Logo: {
        mountX: 0.5,
        mountY: 1,
        x: 960,
        y: 600,
        src: Utils.asset('images/logo.png'),
      },
      Text: {
        mount: 0.5,
        x: 960,
        y: 720,
        text: {
          text: 'Click to start Building!',
          fontFace: 'Regular',
          fontSize: 64,
          textColor: 0xbbffffff,
        },
      },
      StartButton: {
        mount: 0.5,
        x: 960,
        y: 800,
        w: 200,
        h: 50,
        rect: true,
        webkitFlexDirection: true,
        color: 0xfffbb03b,
        Text: {
          w: (w) => w,
          text: {
            text: 'Start',
            textColor: 0xbbffffff,
            textAlign: 'center',
          },
        },
      },
    }
  }

  _init() {
    this.tag('Background')
      .animation({
        duration: 15,
        repeat: -1,
        actions: [
          {
            t: '',
            p: 'color',
            v: { 0: { v: 0xfffbb03b }, 0.5: { v: 0xfff46730 }, 0.8: { v: 0xfffbb03b } },
          },
        ],
      })
      .start()
  }

  _handleEnter() {
    Router.navigate('player')
  }
}
