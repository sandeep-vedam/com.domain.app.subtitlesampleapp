import Lightning from '@lightningjs/core';

import {
  focus,
  settingFocused,
} from '../lib/Styles';

export default class ColorItem extends Lightning.Component {
    static _template() {
        return {
            Focus: {alpha: 0, x: w => w * 0.5, y: h => h * 0.5, mount: 0.5, w: 100, h:60, rect: true, shader: {type: Lightning.shaders.RoundedRectangle, radius: 30, stroke: 4, blend: 1, strokeColor: 0xffffffff, fillColor: 0x00ffffff}},
            Color: {y: 3, w: 84, h: 44, rect: true, shader: {type: Lightning.shaders.RoundedRectangle, radius: 22}}
        }
    }

    _construct() {
        this._focusColor = focus;
        this._focusInactive = settingFocused;
        this._padding = 40;
    }

    _focus(from) {
        if(!from) {
            this.patch({
                Focus: {smooth: {alpha: 1, color: this._focusColor}}
            });
        }
        else {
            this.patch({
                Focus: {smooth: {alpha: 1, color: 0xffffffff}}
            });
        }
    }

    _unfocus(target) {
        if(target && target.isCarouselItem === true) {
            this.patch({
                Focus: {smooth: {alpha: 0}}
            });
        }
        if(target === undefined) {
            this.patch({
                Focus: {smooth: {alpha: 1, color: this._focusInactive}}
            });
        }
    }

    _firstActive() {
        this.tag('Color').color = this.color;
        if(this.collectionWrapper.hasFocus()) {
            return;
        }
        const isSelected = this.cparent.id === this.collectionWrapper.currentItemWrapper.id
        this.patch({
            Focus: {color: this._focusInactive, alpha: isSelected ? 1 : 0},
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
        return 84;
    }

    static get height() {
        return 50;
    }
}