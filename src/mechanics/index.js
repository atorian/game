// @flow

export const ELEMENT_RELATIONS = {
    fire: {weak: 'water', strong: 'wind'},
    water: {weak: 'wind', strong: 'fire'},
    wind: {weak: 'fire', strong: 'water'},
    light: {weak: null, strong: 'dark'},
    dark: {weak: null, strong: 'light'},
};
