import Lightning from '@lightningjs/core';
import { Carousel } from '@lightningjs/ui';
import { defineProperties } from '@lightningjs/ui/src/helpers';

import { settingFocused } from '../lib/Styles';
import LabelItem from './LabelItem.js';

export default class CarouselStepper extends Lightning.Component {
    static _template() {
        return {
            h: 80, w: 574,
            Focus: {alpha: 0, w: w => w, h: h => h, rect: true},
            Label: {x: 30, y: h => h * 0.5, mountY: 0.5, text: {text: '', fontSize: 22}},
            ValueWrapper: {
                x: w => w, w: 440, h: h => h, mountX: 1, rtt: true, shader: {type: Lightning.shaders.FadeOut, left: 80, right: 80},
                Carousel: {type: Carousel, y:15, w: 440, h: 50, scroll: 0.5, spacing: 70, direction: 'row', signals: {onIndexChanged: true}}
            }
        }
    }

    _construct() {
        this._focusColor = settingFocused;
        this._labelColor = 0xff9d9d9d;
        this._labelColorFocused = 0xffffffff;
        this._padding = 44;

        this._options = [];
        this._label = 'label';
        this._focusAnimation = null;
        this._carouselItemType = LabelItem;
        this._carouselSpacing = 70;
        this._carouselIndex = 0;

        defineProperties(this, ['label', 'carouselItemType', 'carouselSpacing', 'carouselIndex'])
    }

    onIndexChanged(obj) {
        if(obj.previousIndex === -1) {
            return;
        }
        this._carouselIndex = obj.index;
        this.fireAncestors('$changeSetting', {
            target: this.setting, 
            ...this.options[obj.index]
        });
    }

    _setup() {
        this.tag('Carousel').itemType = this._carouselItemType
    }

    _update() {
        this.patch({
            Focus: {color: this._focusColor},
            Label: {x: this._padding, color: this._labelColor, text: {text: this._label}},
            ValueWrapper: {x: w => w - this._padding,
                Carousel: {itemType: this._carouselItemType, spacing: this._carouselSpacing}
            }
        });

        if(this.options.length > 0) {
            const carousel = this.tag('Carousel');
            carousel.clear();
            carousel._index = this._carouselIndex;
            carousel.add(this._options.map((option, index) => {return {label: option.label, color: option.value, index, focusColor: this._focusColor, labelColor: this._labelColor, labelColorFocused: this._labelColorFocused}}));
        }
    
        if(this.hasFocus()) {
            this._focus();
        }
    }

    _createFocusAnimation() {
        this._focusAnimation = this.animation({duration: 0.2, stopMethod: 'reverse', actions: [
            {t: 'Focus', p: 'alpha', v: {0: 0, 1: 1}},
            {t: 'Label', p: 'color', v: {0: this._labelColor, 1: this._labelColorFocused}},
            {t: 'ValueWrapper.Value', p: 'color', v: {0: this._labelColor, 1: this._labelColorFocused}},
        ]});
    }

    _firstActive() {
        if(!this._focusAnimation) {
            this._createFocusAnimation();
        }
        this._setState('Idle');
        this._update();
    }

    _focus() {
        if(this._focusAnimation) {
            this._focusAnimation.start();
        }
        const currentItem = this.tag('Carousel').currentItem;
        if(currentItem && currentItem.isAlive) {
            currentItem._focus();
        }
        this.zIndex = 3;
    }

    _unfocus() {
        if(this._focusAnimation) {
            this._focusAnimation.stop();
        }
        const currentItem = this.tag('Carousel').currentItem;
        if(currentItem && currentItem.isAlive) {
            currentItem._unfocus();
        }
        this.zIndex = 1;
        this._setState('Idle');
    }

    set options(arr) {
        this._options = arr;
        if(this.active) {
            this._update();
        }
    }

    get options() {
        return this._options;
    }

    static _states() {
        return [
            class Idle extends this {
                $enter() {
                    this.fireAncestors('$finishAdjusting')
                }
                _handleEnter() {
                    this._setState('ChangeValue');
                }
            },
            class ChangeValue extends this {
                $enter() {
                    this.fireAncestors('$adjustSetting')
                }
                _getFocused() {
                    return this.tag('Carousel');
                }
                _handleEnter() {
                    this._setState('Idle');
                }
            }
        ]
    }
}