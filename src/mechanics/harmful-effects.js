// @flow
import type {Contestant, HitEvent, StatDecrease, System, TemporalEffect, Target} from '../battle'
import {ActionContext} from "../battle";
import target from "./targeting";

type ResistPolicy = (acc: number, res: number) => boolean;

export function createResistPolicy(roll): ResistPolicy {
    return (acc: number, res: number): boolean => {
        return roll() <= Math.max(res - acc, 15);
    }
}

type DebufConf = {
    name: string,
    duration: number,
    irresistable: boolean,
    target: Target,
}

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
        stat: 'glancing',
        value(target: Contestant) {
            return -50;
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

    constructor(resistPolicy: ResistPolicy) {
        this.resist = resistPolicy;
    }

    apply(context: ActionContext, step: DebufStep, events?: Event[] = []): ?DebufEvent[] {
        if (step.debufs) {
            const last_hit = (events.filter(e => e.name === 'hit').pop(): ?HitEvent);
            if (!last_hit || last_hit.payload.type !== 'glancing') {
                const configs = step.debufs.map(configure);
                return configs.reduce((target_events: [], config: DebufConf) => {

                    return [...target_events, ...target(config.target, context).reduce((mechanics_events: [], target: Contestant) => {

                            if (!VALID_DEBUFS.includes(config.name)) {
                                throw new Error(`Unknown Debuf "${config.name}"`);
                            }

                            if (config.irresistable || !this.resist(context.caster.acc, target.res)) {

                                if (STATS_AFFECTED[config.name]) {
                                    const d = STATS_AFFECTED[config.name];
                                    return [...mechanics_events, {
                                        name: 'debuffed',
                                        payload: {
                                            target: target.id,
                                            effect: config.name,
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
                                        effect: config.name,
                                        duration: config.duration,
                                    }
                                }];
                            }

                            return [...mechanics_events, {
                                name: 'resisted',
                                payload: {
                                    target: target.id,
                                    effect: config.name,
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
