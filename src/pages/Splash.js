import {
  Lightning,
  Router,
  Utils,
} from '@lightningjs/sdk';

import { panelBG } from '../lib/Styles';

export default class Splash extends Lightning.Component {
  static _template() {
    return {
      Background: {w: 1920, h:1080, rect:true, color: panelBG},
      Logo: {mount: 0.5, x: 960, y: 540, src: Utils.asset('logo.png'), color: 0xff9249e8},
      Labels: {
        alpha: 0, y: 590,
        LightningJS: {mount: 0.5, x: 960, text: {text: 'LightningJS', fontFace: 'Roboto', fontSize: 64}},
        Examples: {mount: 0.5, x: 960, y: 665 - 590, color: 0xff009245, text: {text: 'EXAMPLES', fontFace: 'Archivo', fontSize: 64}},
        ClosedCaptions: {mount: 0.5, x: 960, y: 740 - 590, text: {text: 'Closed Captions', fontFace: 'Archivo', fontSize: 32}},
      },
      Continue: {
        alpha: 0, mount: 0.5, x: 960, y: 940, text: {text: 'Press any key to continue', fontFace: 'Lato', fontSize: 28}
      }
    }
  }

  _init() {
    this.splashIntro = this.animation({duration: 1, actions: [
      {t: 'Logo', p: 'color', v: {0: 0xff9249e8, 0.7: 0xff009245}},
      {t: 'Logo', p: 'y', v: {0: 540, 1: 440}},
      {t: 'Labels', p: 'y', v: {0: 690, 1: 590}},
      {t: 'Labels', p: 'alpha', v: {0: 0, 1: 1}},
    ]});

    this.blinkContinue = this.tag('Continue').animation({duration: 3, repeat: -1, actions: [
      {p: 'alpha', v: {0: 0, 0.5: 1, 1: 0}},
    ]});

    this.splashIntro.on('finish', () => {
      this.blinkContinue.start();
    });
  }

  _active() {
    this.startSplashDelay();
  }

  startSplashDelay() {
    setTimeout(() => {
        this.delayPassed = true;
        this.startAnimation();
    }, 800);
  }

  startAnimation() {
    if(!this.delayPassed) {
        return;
    }
    this.splashIntro.start();
  }

  _handleKey() {
    Router.navigate('player')
  }
}
