// @flow
import type {Contestant, HitEvent, StatDecrease, System, TemporalEffect, Target} from '../battle'
import {ActionContext, Temporal} from "../battle";
import target from "./targeting";
import _ from 'lodash';

type ResistPolicy = (acc: number, res: number) => boolean;

export function createResistPolicy(roll): ResistPolicy {
    return (acc: number, res: number): boolean => {
        return roll() <= Math.max(res - acc, 15);
    }
}

type Irresistable = {
    irresistable: boolean,
}
type WithChance = {
    chance?: number,
}
type KnownDebuf = TemporalEffect & Irresistable & WithChance;
type RandomDebuf = Target & Temporal & Irresistable & WithChance & {
    random: string[]
}

type DebufConf = KnownDebuf | RandomDebuf;

function configure(conf: any): DebufConf {
    return {
        duration: 1,
        irresistable: false,
        target: 'enemy',
        ...conf,
    }
}

const STATS_AFFECTED = {
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
    }
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


type DebufStep = {
    debufs?: DebufConf[]
}

type DebufEvent = StatDecrease | TemporalEffect;

export class HarmfulEffects implements System {
    resist: ResistPolicy;
    roll: () => number;

    constructor(resistPolicy: ResistPolicy, roll) {
        this.resist = resistPolicy;
        this.roll = roll;
    }

    apply(context: ActionContext, step: DebufStep, events?: Event[] = []): ?DebufEvent[] {
        if (step.debufs) {
            const last_hit = (events.filter(e => e.name === 'hit').pop(): ?HitEvent);
            if (!last_hit || last_hit.payload.type !== 'glancing') {
                const configs = step.debufs.map(configure);
                return configs.reduce((target_events: [], config: DebufConf) => {

                    return [...target_events, ...target(config.target, context).reduce((mechanics_events: [], target: Contestant) => {

                        if (config.chance && this.roll() > configs.chance) {
                            return mechanics_events;
                        }

                        const effect = config.effect ? config.effect : _.sample(config.random);

                            if (!VALID_DEBUFS.includes(effect)) {
                                throw new Error(`Unknown Debuf "${effect}"`);
                            }

                            if (config.irresistable || !this.resist(context.caster.acc, target.res)) {

                                if (STATS_AFFECTED[effect]) {
                                    const d = STATS_AFFECTED[effect];
                                    return [...mechanics_events, {
                                        name: 'debuffed',
                                        payload: {
                                            target: target.id,
                                            effect: effect,
                                            duration: config.duration,
                                            stat: d.stat,
                                            value: d.value(target)
                                        }
                                    }];
                                }

                                return [...mechanics_events, {
                                    name: 'debuffed',
                                    payload: {
                                        target: target.id,
                                        effect: effect,
                                        duration: config.duration,
                                    }
                                }];
                            }

                            return [...mechanics_events, {
                                name: 'resisted',
                                payload: {
                                    target: target.id,
                                    effect: effect,
                                }
                            }];
                        },
                        []
                    )
                    ];
                }, []);
            }
        }
    }
}
