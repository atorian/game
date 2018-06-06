// @flow
import type {Contestant, HitEvent, StatDecrease, Mechanics, TemporalEffect, Target} from '../battle'
import {ActionContext, Temporal} from "../battle";
import target from "./targeting";
import {HarmfulEffectsFactory} from "./index";

export type ResistPolicy = (acc: number, res: number) => boolean;

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

type DebufConf = KnownDebuf | RandomDebuf;

function configure(conf: any): DebufConf {

    if (typeof cont === 'number') {
        return {
            duration: cont,
            irresistable: false,
        }
    }

    return {
        duration: 1,
        irresistable: false,
        ...conf,
    }
}

type DebufStep = {
    debufs?: DebufConf[]
}

type DebufEvent = StatDecrease | TemporalEffect;

export class HarmfulEffects implements Mechanics {
    resist: ResistPolicy;
    roll: () => number;

    constructor(resistPolicy: ResistPolicy, roll, debuf) {
        this.resist = resistPolicy;
        this.roll = roll;
        this.debuf = debuf;
    }

    apply(context: ActionContext, step: DebufStep, events?: Event[] = []): ?DebufEvent[] {

        const config = configure(step);

        const last_hit = (events.filter(e => e.name === 'hit').pop(): ?HitEvent);

        if (!last_hit || last_hit.payload.type !== 'glancing') {
            return target(config.target, context)
                .filter(u => u.hp)
                .reduce((mechanics_events: [], target: Contestant) => {

                        if (config.chance && this.roll() > config.chance) {
                            return mechanics_events;
                        }

                        if (config.irresistable || !this.resist(context.caster.acc, target.res)) {
                            return [...mechanics_events, {
                                name: 'debuffed',
                                payload: {
                                    ...this.debuf(target),
                                    target: target.id,
                                    duration: config.duration,
                                },
                            }];
                        }

                        return [...mechanics_events, {
                            name: 'resisted',
                            payload: {
                                target: target.id,
                                effect: config.effect,
                            }
                        }];
                    },
                    []
                )
        }
    }
}

