import { Colors } from '@lightningjs/sdk';

const colors = {
    white: 0xffffffff,
    yellow: 0xfff3ce32,
    green: 0xff009900,
    cyan: 0xff00cdcd,
    blue: 0xff0000af,
    magenta: 0xffd300d2,
    red: 0xffdb0000,
    black: 0xff000000,
}

const core_settings = {
    fonts: {
        'Archivo': 'fonts/Archivo-Regular.ttf',
        'Arial': 'fonts/Arial-Regular.ttf',
        'Helvetica': 'fonts/Helvetica-Regular.ttf',
        'Lato': 'fonts/Lato-Regular.ttf',
        'OpenSans': 'fonts/OpenSans-Regular.ttf',
        'Roboto': 'fonts/Roboto-Regular.ttf',
        'Tahoma': 'fonts/Tahoma-Regular.ttf',
        'Times': 'fonts/Times-Regular.ttf',
        'Verdana': 'fonts/Verdana-Regular.ttf',
    },
    fontSizes: {
        '50%': 0.5,
        '75%': 0.75,
        '100%': 1,
        '150%': 1.5,
        '200%': 2,
        '300%': 3,
        '400%': 4,
    },
    fontOpacities: {
        '25%': 0.25,
        '50%': 0.5,
        '75%': 0.75,
        '100%': 1,
    },
    fontColors: colors,
    backgroundOpacities: {
        '0%': 0,
        '25%': 0.25,
        '50%': 0.5,
        '75%': 0.75,
        '100%': 1,
    },
    backgroundColors: colors,
    horizontalAlignments: {
        'left': 'left',
        'center': 'center',
        'right': 'right'
    },
    verticalAlignments: {
        'top': 'top',
        'center': 'center',
        'bottom': 'bottom'
    }
}

const mapObject = (obj) => {
    return Object.keys(obj).map((key) => ({
        label: key,
        value: obj[key]
    }));
}

const export_settings = {};
for(let key in core_settings) {
    export_settings[key] = mapObject(core_settings[key]);
}

export const normalizeColor = (target, settings) => {
    const color = colors[settings[`${target}Color`]];
    const opacity = core_settings[`${target}Opacities`][settings[`${target}Opacity`]];
    return Colors(color).alpha(opacity).get();
}

export const normalizeSetting = (target, settings) => {
    switch(target) {
        case 'backgroundColor':
        case 'backgroundOpacity':
            return {
                target: 'backgroundColor',
                value: normalizeColor('background', settings)
            }
        case 'fontColor':
        case 'fontOpacity':
            return {
                target: 'fontColor',
                value: normalizeColor('font', settings)
            }
        case 'fontSize': 
            return {
                target: 'fontSize',
                value: 1920 / 100 * 2.5 * core_settings.fontSizes[settings[target]]
            }
    }
    return {
        target,
        value: settings[target]
    }
}

export const normalizeSettings = (settings) => {
    const styles = {};
    for(let key in settings) {
        const setting = normalizeSetting(key, settings);
        const {target, value} = setting;
        styles[target] = value;
    }
    return styles;
}

export const default_settings = {
    fontFamily: 'Lato',
    fontSize: '100%',
    fontOpacity: '100%',
    fontColor: 'white',
    backgroundOpacity: '0%',
    backgroundColor: 'black',
    posX: 'center',
    posY: 'bottom'
}

export const getDefaultSettings = () => {
    return normalizeSettings(default_settings);
}

export default export_settings