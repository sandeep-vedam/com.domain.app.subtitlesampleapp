import Lightning from '@lightningjs/core';

import {
  focus,
  label,
  settingFocused,
} from '../lib/Styles';

export default class LabelItem extends Lightning.Component {
    static _template() {
        return {
            Focus: {alpha: 0, x: w => w * 0.5, y: h => h * 0.5, mount: 0.5, w: 120, h:50, rect: true, shader: {type: Lightning.shaders.RoundedRectangle, radius: 25}},
            Label: {x: w => w * 0.5, y: h => h * 0.5, color: label, mount: 0.5, renderOffscreen: true, text: {text: '', fontSize: 22}}
        }
    }

    _construct() {
        this._focusColor = focus;
        this._focusInactive = settingFocused;
        this._labelColor = label;
        this._labelColorFocused = 0xffffffff;
        this._padding = 30;
    }

    set label(str) {
        this.tag('Label').text.text = str;
        this._label = str;
    }

    get label() {
        return this._label;
    }

    _init() {
        const label = this.tag('Label');
        label.on('txLoaded', () => {
            this.patch({
                w: label.renderWidth,
                Focus: {w: label.renderWidth + this._padding * 2}
            });
            if(this.collectionWrapper) {
                this.collectionWrapper.reposition(1);
            }
        });
    }

    _focus(from) {
        if(!from) {
            this.patch({
                Focus: {smooth: {alpha: 1, color: this._focusColor}},
                Label: {smooth: {color: this._labelColorFocused}}
            });
        }
        else {
            this.patch({
                Focus: {smooth: {alpha: 1, color: 0xffffffff}},
                Label: {smooth: {color: 0xff000000}}
            });
        }
    }

    _unfocus(target) {
        if(target && target.isCarouselItem === true) {
            this.patch({
                Focus: {smooth: {alpha: 0}},
                Label: {smooth: {color: this._labelColor}}
            });
        }
        if(target === undefined) {
            this.patch({
                Focus: {smooth: {alpha: 1, color: this._focusInactive}},
                Label: {smooth: {color: this._labelColorFocused}}
            });
        }
    }

    _firstActive() {
        if(this.collectionWrapper.hasFocus()) {
            return;
        }
        const isSelected = this.cparent.id === this.collectionWrapper.currentItemWrapper.id
        this.patch({
            Focus: {color: this._focusInactive, alpha: isSelected ? 1 : 0},
            Label: {color: isSelected ? this._labelColorFocused : this._labelColor},
        });
        if(isSelected && this.collectionWrapper.cparent.hasFocus()) {
            this._focus();
        }
    }

    _handleEnter() {
        this._focus(false);
        return false;
    }

    get isCarouselItem() {
        return true;
    }

    static get width() {
        return 70;
    }

    static get height() {
        return 50;
    }
}