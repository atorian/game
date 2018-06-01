// @flow
import type {Contestant, ActionContext, TemporalEffect, AllyTarget, System, Effect} from '../battle'
import target from './targeting';

// not target as it's only allowed to target ally
type Buf = TemporalEffect & {
    aoe: boolean,
    target: AllyTarget
}

function configure(conf): Buf {
    return {
        duration: 1,
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
            const configs = step.bufs.map(configure);

            return configs.reduce((all_events, config) => {
                return [...all_events, ...target(config.target, context)
                    .reduce((target_events: [], target: Contestant) => {

                            if (!VALID_BUFS.includes(config.name)) {
                                throw new Error(`Unknown Buf "${config.name}"`);
                            }

                            if (STATS_AFFECTED[config.name]) {
                                const b = STATS_AFFECTED[config.name];
                                return [...target_events, {
                                    name: 'buffed',
                                    payload: {
                                        target: target.id,
                                        effect: config.name,
                                        duration: config.duration,
                                        stat: b.stat,
                                        value: b.value(target)
                                    }
                                }]
                            }

                            return [...target_events, {
                                name: 'buffed',
                                payload: {
                                    target: target.id,
                                    effect: config.name,
                                    duration: config.duration,
                                }
                            }];
                        },
                        []
                    )
                ]
            }, []);
        }
    }
}
