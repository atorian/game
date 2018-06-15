// @flow
import type {Contestant, TemporalEffect, AllyTarget} from '../'
import type {ActionContext, Mechanics} from '../skill-mechanics';
import target from './targeting';

// not target as it's only allowed to target ally
type Buf = TemporalEffect & {
    target: AllyTarget
}

function configure(conf: number | Object): Buf {
    if (typeof conf === 'number') {
        return {
            duration: conf,
        }
    }

    return {
        duration: 1,
        ...conf,
    }
}

export const VALID_BUFS = [
    'immunity',
    'invincibility',
    'defend',
    'endure',
    'revenge',
    'recovery',
    'counter',
    'soul_protect',
    'reflect',
    // 'shield',
    // 'rune shield',
];

export const BUFFS = {
    def_buf(target) {
        return {
            stat: 'def',
            value: target.max_def * 0.7
        }
    },
    atk_buf(target) {
        return {
            effect: 'atk_buf',
            stat: 'atk',
            value: target.max_atk * 0.5
        }
    },
    haste(target) {
        return {
            effect: 'haste',
            stat: 'spd',
            value: target.max_spd * 0.3,
        }
    },
    anti_crit() {
        return {
            effect: 'anti_crit',
            stat: 'incoming_crit_mod',
            value: 50,
        }
    },
    crit_buf(target) {
        return {
            effect: 'crit_buf',
            stat: 'cr',
            value: 30,
        }
    },
    ...VALID_BUFS.reduce((buffs, name)  => {
        return {
            ...buffs,
            [name]: () => ({effect: name})
        }
    },{})
};

export class BeneficialEffects implements Mechanics {
    constructor(buf) {
        this.buf = buf;
    }

    apply(context: ActionContext, step: Buf, events: Event[]): ?Event[] {
        const config = configure(step);
        return target(config.target, context)
            .reduce((target_events: [], target: Contestant) => {
                    return [...target_events, {
                        name: 'buffed',
                        payload: {
                            ...this.buf(target),
                            target: target.id,
                            duration: config.duration,
                        }
                    }]
                },
                []
            );
    }
}
