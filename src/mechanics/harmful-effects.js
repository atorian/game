// @flow
import type {Contestant, System} from '../battle'
import {ActionContext} from "../battle";

type ResistPolicy = (acc: number, res: number) => boolean;

export function createResistPolicy(roll): ResistPolicy {
    return (acc: number, res: number): boolean => {
        return roll() <= Math.max(res - acc, 15);
    }
}

type Debuf = {
    name: string,
    duration: number,
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
            return target.max_atk * 0.7
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

export class HarmfulEffects implements System {
    resist: ResistPolicy;

    constructor(resistPolicy: ResistPolicy) {
        this.resist = resistPolicy;
    }

    apply(context: ActionContext, step: any, events: Event[]) {
        if (step.debufs) {
            const last_hit = events.filter(e => e.name === 'hit').pop();
            if (!last_hit || last_hit.payload.type !== 'glancing') {
                return step.debufs.map((debuf: Debuf) => {
                    if (!this.resist(context.caster.acc, context.target.res)) {

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
