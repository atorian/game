// @flow
import type {Contestant, Effect, System, Targeted} from '../battle'
import {ActionContext} from "../battle";
import target from "./targeting";
import _ from 'lodash';
import type {ResistPolicy} from "./harmful-effects";
import {VALID_BUFS} from "./beneficial-effects";

type Irresistable = {
    irresistable: boolean,
}
type WithChance = {
    chance?: number,
}
type StripConf = Targeted & Irresistable & WithChance & {
    amount: number | 'all'
};

function configure(conf: any): StripConf {
    return {
        irresistable: false,
        ...conf,
    }
}

type Step = {
    strip?: StripConf
}

type StripEvent = {
    name: 'strip',
    payload: {
        target: string,
        effect: string,
    }
};


export class Strip implements System {
    resist: ResistPolicy;
    roll: () => number;

    constructor(resistPolicy: ResistPolicy, roll) {
        this.resist = resistPolicy;
        this.roll = roll;
    }

    apply(context: ActionContext, step: Step, events?: Event[] = []): ?StripEvent[] {
        if (step.strip) {
            const config: StripConf = configure(step.strip);
            return target(config.target, context).reduce((mechanics_events: [], target: Contestant) => {

                if (config.chance && this.roll() > config.chance) {
                    return mechanics_events;
                }

                if (config.irresistable || !this.resist(context.caster.acc, target.res)) {

                    const target_bufs: Effect[] = target.effects.filter(e => VALID_BUFS.includes(e.effect));

                    let effects_stripped = target_bufs;
                    if (config.amount !== 'all') {
                        effects_stripped = _.sampleSize(target_bufs, config.amount);
                    }

                    return [...mechanics_events, ...effects_stripped.map(e => ({
                        name: 'strip',
                        payload: {
                            target: target.id,
                            effect: e.effect,
                        }
                    }))];
                }

                return [...mechanics_events, {
                    name: 'resisted',
                    payload: {
                        target: target.id,
                        effect: 'strip',
                    }
                }];
            }, []);
        }
    }
}
