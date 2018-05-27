// @flow
import type {Contestant, HitEvent, StatDecrease, System, TemporalEffect, Target} from '../battle'
import {ActionContext} from "../battle";

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
                return step.debufs.map((conf: DebufConf) => {
                    const debuf = configure(conf);

                    if (!VALID_DEBUFS.includes(debuf.name)) {
                        throw new Error(`Unknown Debuf "${debuf.name}"`);
                    }

                    if (debuf.irresistable || !this.resist(context.caster.acc, context.target.res)) {

                        if (STATS_AFFECTED[debuf.name]) {
                            const d = STATS_AFFECTED[debuf.name];
                            return [{
                                name: 'debuffed',
                                payload: {
                                    target: context.target.id,
                                    effect: debuf.name,
                                    duration: debuf.duration,
                                    stat: d.stat,
                                    value: d.value(context.target)
                                }
                            }];
                        }

                        return [{
                            name: 'debuffed',
                            payload: {
                                target: context.target.id,
                                effect: debuf.name,
                                duration: debuf.duration,
                            }
                        }];
                    }

                    return [{
                        name: 'resisted',
                        payload: {
                            target: context.target.id,
                            effect: debuf.name,
                        }
                    }];
                });
            }
        }

        return [];
    }
}
