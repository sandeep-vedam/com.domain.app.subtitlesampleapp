import {
  Lightning,
  Storage,
  Subtitles,
} from '@lightningjs/sdk';
import { Grid } from '@lightningjs/ui';

import Settings, {
  default_settings,
  normalizeSetting,
} from '../lib/Settings.js';
import {
  focus,
  label as labelColor,
  panelBG,
  panelFocusedBG,
} from '../lib/Styles';
import CarouselStepper from './CarouselStepper.js';
import ColorItem from './ColorItem.js';

export default class ClosedCaption extends Lightning.Component {
    static _template() {
        return {
            alpha: 0, x: 30, y: 1050, mountY: 1, w: 1860, h: 462, rect: true, color: panelBG,
            BackgroundFocus: {
                w: w => w*0.5, h: h => h, rect: true, color: panelFocusedBG
            },
            Title: {
                x: 44, y: 40, text: {text: 'Closed Caption Configuration', fontFace: 'Lato', fontSize: 38}
            },
            Grid: {
                y: 120, h: 320, w: w => w, type: Grid, spacing: 0, direction: 'row', passSignals: {onFocus: true}
            },
            Blockout: {
                zIndex: 2, alpha: 0, w: w => w, h: h => h, rect: true, color: panelFocusedBG
            }
        }   
    }

    _setup(){
        const styles = {
            labelColor: labelColor,
            focusColor: focus,
            padding: 44,
        }

        this._currentSettings = Storage.get('ClosedCaptionSettings');
        if(!this._currentSettings) {
            this._currentSettings = {...default_settings}
        }

        const {fonts, fontSizes, fontOpacities, fontColors, backgroundOpacities, backgroundColors, horizontalAlignments, verticalAlignments} = Settings;
        const {fontFamily, fontSize, fontOpacity, fontColor, backgroundOpacity, backgroundColor, xPos, yPos} = this._currentSettings;

        const indexOf = (setting, settings) => {
            for(let i = 0; i < settings.length; i++) {
                if(settings[i].label === setting) {
                    return i;
                }
            }
            return 0;
        }

        this.tag('Grid').items = [
            {
                ...styles, 
                type: CarouselStepper, 
                carouselSpacing: 56, 
                carouselIndex: indexOf(fontFamily, fonts), 
                setting: 'fontFamily',
                h: 80, 
                w: 930, 
                label: 'Font Family', 
                options: fonts
            },
            {
                ...styles,
                type: CarouselStepper,
                carouselSpacing: 56,
                carouselIndex: indexOf(fontSize, fontSizes), 
                setting: 'fontSize',
                h: 80,
                w: 930,
                label: 'Font Size',
                options: fontSizes
            },
            {   ...styles,
                type: CarouselStepper,
                carouselSpacing: 56,
                carouselIndex: indexOf(fontOpacity, fontOpacities),
                setting: 'fontOpacity',
                h: 80,
                w: 930,
                label: 'Font Opacity',
                options: fontOpacities
            },
            {   
                ...styles,
                type: CarouselStepper,
                carouselItemType: ColorItem,
                carouselSpacing: 34,
                carouselIndex: indexOf(fontColor, fontColors),
                setting: 'fontColor',
                h: 80,
                w: 930,
                label: 'Font Color',
                options: fontColors
            },
            {
                ...styles,
                type: CarouselStepper,
                carouselSpacing: 56,
                carouselIndex: indexOf(backgroundOpacity, backgroundOpacities),
                setting: 'backgroundOpacity',
                h: 80,
                w: 930,
                label: 'Background Opacity',
                options: backgroundOpacities
            },
            {
                ...styles,
                type: CarouselStepper,
                carouselItemType: ColorItem,
                carouselSpacing: 34,
                carouselIndex: indexOf(backgroundColor, backgroundColors),
                setting: 'backgroundColor',
                h: 80,
                w: 930,
                label: 'Background Color',
                options: backgroundColors
            },
            {
                ...styles,
                type: CarouselStepper,
                carouselSpacing: 56,
                carouselIndex: indexOf(xPos, horizontalAlignments),
                setting: 'xPos',
                h: 80,
                w: 930,
                label: 'Horizontal Alignment',
                options: horizontalAlignments
            },
            {
                ...styles,
                type: CarouselStepper,
                carouselSpacing: 56,
                carouselIndex: indexOf(yPos, verticalAlignments),
                setting: 'yPos',
                h: 80,
                w: 930,
                label: 'Vertical Alignment',
                options: verticalAlignments
            },
        ]
    }

    $adjustSetting() {
        this.tag('Blockout').setSmooth('alpha', 0.8);
    }

    $finishAdjusting() {
        this.tag('Blockout').setSmooth('alpha', 0);
    }

    $changeSetting(e) {
        let {target, label} = e;
        this._currentSettings[target] = label
        const {target:t, value:v} = normalizeSetting(target, this._currentSettings);
        const styles = {};
        styles[t] = v;
        Subtitles.styles(styles);
        Storage.set('ClosedCaptionSettings', this._currentSettings);
    }

    show() {
        this.alpha = 1;
        Subtitles.viewport(this.application.finalW, 618);
    }

    hide() {
        this.alpha = 0;
        Subtitles.viewportH(this.application.finalW, this.application.finalH);
    }

    _getFocused() {
        return this.tag('Grid')
    }
}