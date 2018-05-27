// @flow
import type {Contestant, ActionContext, TemporalEffect, AllyTarget, System, Effect} from '../battle'

// not target as it's only allowed to target ally
type Buf = TemporalEffect & {
    aoe: boolean,
    target: AllyTarget
}

function configure(conf): Buf {
    return {
        duration: 1,
        aoe: false,
        target: "ally",
        ...conf,
    }
}

const STATS_AFFECTED = {
    'def_buf': {
        stat: 'def',
        value(target: Contestant) {
            return target.max_def * 0.7
        }
    },
    'atk_buf': {
        stat: 'atk',
        value(target: Contestant) {
            return target.max_atk * 0.5
        }
    },
    'haste': {
        stat: 'spd',
        value(target: Contestant) {
            return target.max_spd * 0.3
        }
    },
    'anti_crit': {
        stat: 'incoming_crit_mod',
        value(target: Contestant) {
            return -50;
        }
    },
    'crit_buf': {
        stat: 'cr',
        value(target: Contestant) {
            return 30;
        }
    }
};

const VALID_BUFS = [
    ...Object.keys(STATS_AFFECTED),
    'immunity',
    'invincibility',
    'defend',
    'endure',
    'revenge',
    'recovery',
    'counter',
    'soul protect',
    'reflect',
    'shield',
    'rune shield',
];

type BufStep = {
    bufs?: Buf[]
}

export class BeneficialEffects implements System {
    apply(context: ActionContext, step: BufStep, events: Event[]): ?Event[] {
        if (step.bufs) {
            return [].concat(...step.bufs.map((conf: Effect) => {
                const buf = configure(conf);

                // todo: process aoe and targeting

                if (!VALID_BUFS.includes(buf.name)) {
                    throw new Error(`Unknown Buf "${buf.name}"`);
                }

                if (STATS_AFFECTED[buf.name]) {
                    const b = STATS_AFFECTED[buf.name];
                    return [{
                        name: 'buffed',
                        payload: {
                            target: context.target.id,
                            effect: buf.name,
                            duration: buf.duration,
                            stat: b.stat,
                            value: b.value(context.target)
                        }
                    }];
                }

                return [{
                    name: 'buffed',
                    payload: {
                        target: context.target.id,
                        effect: buf.name,
                        duration: buf.duration,
                    }
                }];
            }));
        }
    }
}
