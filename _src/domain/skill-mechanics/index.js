// @flow
import _ from 'lodash';
import {createResistPolicy, HarmfulEffects, ResistPolicy} from "./harmful-effects";
import {Event} from "../battle";
import RandomHarmfulEffects from "./random-harmful-effects";
import {AtbManipulation} from "./atb-effects";
import {Heal} from "./heal";
import {Revive} from "./revive";
import {EnemyDmgSystem, HitStrategyFactory, Multiplier} from "./enemy-damage";
import {BeneficialEffects, BUFFS} from "./beneficial-effects";
import {Strip} from "./strip";
import type {Contestant, Skill} from "../index";


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
    ...VALID_DEBUFS.reduce((debufs, name) => {
        return {
            ...debufs,
            [name]: () => ({effect: name})
        }
    }, {})
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

export type ActionContext = {
    caster: Contestant,
    battlefield: Contestant[],
    target: Contestant,
    skill: Skill
}

export interface Mechanics {
    apply(context: ActionContext, step: any, events: Event[]): Event[];
}

const harmfulEffectsFactory = new HarmfulEffectsFactory(
    createResistPolicy(roll),
    roll,
);

export default class SkillMechanics {

    constructor() {
        this.mechanics = new Map();
        this.mechanics.set('enemy_dmg', new EnemyDmgSystem(
            new HitStrategyFactory(roll),
            new Multiplier()
        ));

        for (const debuf of [
            'def_break',
            'atk_break',
            'slow',
            'glancing',
            'brand',
            'block_buf',
            'unrecoverable',
            'taunt',
            'oblivion',
            'freeze',
            'stun',
            'sleep',
            'silence',
        ]) {
            this.mechanics.set(
                debuf,
                harmfulEffectsFactory.create(debuf)
            );
        }

        this.mechanics.set(
            'random_debuf',
            new RandomHarmfulEffects(harmfulEffectsFactory)
        );

        this.mechanics.set('atb_boost', new AtbManipulation('increase'));
        this.mechanics.set('atb_decrease', new AtbManipulation('decrease'));
        this.mechanics.set('heal', new Heal(new Multiplier()));
        this.mechanics.set('revive', new Revive(new Multiplier()));
        // todo: add `dot` and `bomb` skill_mechanics


        for (const buf in BUFFS) {
            this.mechanics.set(buf, new BeneficialEffects(BUFFS[buf]));
        }

        this.mechanics.set('strip', new Strip(
            createResistPolicy(roll),
            roll,
        ));
    }

    set(id, mechanic) {
        this.mechanics.set(id, mechanic);
    }

    apply(context: ActionContext) {
        // todo: add random amount of iterations @see Rigel, Okeanos
        return context.skill.iterations.reduce((events, step) => {
            return Object.keys(step).reduce((accumulated_events, mechanic_id) => {

                if (this.mechanics.has(mechanic_id)) {
                    return [
                        ...accumulated_events,
                        ...(this.mechanics.get(mechanic_id).apply(
                            context,
                            step[mechanic_id],
                            accumulated_events
                        ) || []),
                    ]
                }

                console.debug('unknown skill_mechanics: ', mechanic_id);
                return accumulated_events;

            }, events);
        }, []);
    }
}
