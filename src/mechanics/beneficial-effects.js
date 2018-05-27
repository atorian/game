// @flow
import type {Contestant, System} from '../battle'
import type {Target} from ".";
import {ActionContext} from "../battle";

type Buf = {
    name: string,
    duration: number,
    target: Target,
}

function configure(conf): Buf {
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

export class HarmfulEffects implements System {
    resist: ResistPolicy;

    constructor(resistPolicy: ResistPolicy) {
        this.resist = resistPolicy;
    }

    apply(context: ActionContext, step: any, events: Event[]) {
        if (step.debufs) {
            const last_hit = events.filter(e => e.name === 'hit').pop();
            if (!last_hit || last_hit.payload.type !== 'glancing') {
                return step.debufs.map((conf: Effect) => {
                    const debuf = configureDebuf(conf);

                    if (!VALID_DEBUFS.includes(debuf.name)) {
                        throw new Error(`Unknown Debuf "${debuf.name}"`);
                    }

                    if (debuf.irresistable || !this.resist(context.caster.acc, context.target.res)) {

                        if (STATS_AFFECTED[debuf.name]) {
                            const d = STATS_AFFECTED[debuf.name];
                            return {
                                name: 'debuffed',
                                payload: {
                                    target: context.target.id,
                                    effect: debuf.name,
                                    duration: debuf.duration,
                                    stat: d.stat,
                                    value: d.value(context.target)
                                }
                            };
                        }

                        return {
                            name: 'debuffed',
                            payload: {
                                target: context.target.id,
                                effect: debuf.name,
                                duration: debuf.duration,
                            }
                        };
                    }

                    return {
                        name: 'resisted',
                        payload: {
                            unit_id: context.target.id,
                            effect: debuf.name,
                        }
                    };
                })
            }
        }

        return [];
    }
}
