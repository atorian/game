// @flow
import _ from 'lodash';
import {createResistPolicy, HarmfulEffects, ResistPolicy} from "./harmful-effects";
import type {Contestant, Mechanics, TemporalEffect} from "../battle";
import {ActionContext} from "../battle";


export const ELEMENT_RELATIONS = {
    fire: {weak: 'water', strong: 'wind'},
    water: {weak: 'wind', strong: 'fire'},
    wind: {weak: 'fire', strong: 'water'},
    light: {weak: null, strong: 'dark'},
    dark: {weak: null, strong: 'light'},
};


const VALID_DEBUFS = [
    'def_break',
    'atk_break',
    'slow',
    'glancing',
    'brand',
    'block_buf',
    'unrecoverable',
    'taunt',
    'oblivion',
    'dot',
    'bomb',
    'freeze',
    'stun',
    'sleep',
    'silence',
];

const DEBUFFS = {
    'def_break': {
        stat: 'def',
        value(target: Contestant) {
            return target.max_def * 0.7
        }
    },
    'atk_break': {
        stat: 'atk',
        value(target: Contestant) {
            return target.max_atk * 0.5
        }
    },
    'slow': {
        stat: 'spd',
        value(target: Contestant) {
            return target.max_spd * 0.3
        }
    },
    'glancing': {
        stat: 'glancing_mod',
        value(target: Contestant) {
            return 50;
        }
    },
    ...VALID_DEBUFS.reduce((debufs, name)  => {
        return {
            ...debufs,
            [name]: () => ({effect: name})
        }
    },{})
};

// todo: rename Mechanics to Mechanics
export class HarmfulEffectsFactory {
    resist: ResistPolicy;
    roll: () => number;
    constructor(resistPolicy: ResistPolicy, roll) {
        this.resist = resistPolicy;
        this.roll = roll;
    }
    create(debuf): Mechanics {

        if (DEBUFFS[debuf]) {

            return new HarmfulEffects(
                this.resist,
                this.roll,
                DEBUFFS[debuf]
            );
        }

        throw new Error(`Unknown debuf: ${debuf}`);
    }
}

export const roll = () => _.random(1, 100);

export class RandomHarmfulEffects {
    constructor(harm: HarmfulEffectsFactory) {
        this.harm = harm;
    }
    apply(context: ActionContext, steps: Object[], events?: Event[] = []): Object[] {
        const config = _.sample(steps);
        const debuf = Object.keys(config)[0];
        return this.harm.create(debuf).apply(context, config, events);
    }
}


export default new HarmfulEffectsFactory(
    createResistPolicy(roll),
    roll,
);
