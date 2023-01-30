import { Lightning } from '@lightningjs/sdk';

import { focus } from '../lib/Styles';

export default class Loader extends Lightning.Component {
    static _template() {
        return {
            alpha: 1, w: 50, h: 50, rect: true, shader: {type: Lightning.shaders.Spinner2, period: 1.4, radius: 6, stroke: 11, backgroundColor: 0x00ffffff}
        }
    }

    _construct() {
        this._displayType = Loader.DISPLAY_TYPES.standard;
    }

    _setup() {
        this.alpha = this._displayType;
        this.showAnimation = this.animation({duration: 0.4, stopMethod: 'reverse', actions: [
          {p: 'alpha', v: {0: this._displayType, 0.3: 1}},
          {p: 'shader.radius', v: {0: 6, 1: 20}},
          {p: 'shader.stroke', v: {0.6: 11, 1: 6}},
          {p: 'shader.color', v: {0.6: 0x00ffffff, 1: focus}}
        ]});

        this.showAnimation.on('stopFinish', () => {
            this.signal('onLoaderStopped');
        });

        this.showAnimation.on('finish', () => {
            this.signal('onLoaderStarted');
        });
    }

    show() {
        this.showAnimation.start();
    }

    hide() {
        this.showAnimation.stop();
    }

    toggle() {
        if(this.showAnimation.isPlaying() || this.showAnimation.isFinished()) {
            this.hide();
        }
        else {
            this.show();
        }
    }

    set displayType(str) {
        if(!Loader.DISPLAY_TYPES[str]) {
            this._displayType = Loader.DISPLAY_TYPES.standard;
            return;
        }
        this._displayType = Loader.DISPLAY_TYPES[str];
    }

    get displayType() {
        return this._displayType;
    }
}

Loader.DISPLAY_TYPES = {
    standard: 0,
    bullet: 1
};
