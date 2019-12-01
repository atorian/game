// @flow
import type {Contestant} from '../'
import type {ActionContext, Mechanics, } from '../skill-mechanics';
import target from './targeting';
import {TargetModifier} from "../battle";
import * as conditions from './conditions';

type Conditional = {
    condition?: 'is_crit',
}

type AtbStep = Conditional & TargetModifier;

function configure(conf: number | Object): AtbStep {

    if (typeof conf === 'number') {
        return {
            value: conf,
        };
    }

    if (!conf.value) {
        throw new Error('Missing config parameter "value"');
    }

    return conf;
}

type ATBEffect = 'increase'|'decrease';

export class AtbManipulation implements Mechanics {
    constructor(effect:ATBEffect) {
        this.effect = effect;
    }
    apply(context: ActionContext, step: AtbStep, events: Event[]): ?Event[] {
        const config:AtbStep = configure(step);
        return target(config.target, context).reduce((mechanics_events: [], target: Contestant) => {
            if (config.condition) {
                if (conditions[config.condition].isOk(events)) {
                    return [...mechanics_events, {
                        name: `atb_${this.effect}`,
                        payload: {
                            target: target.id,
                            value: config.value,
                        }
                    }]
                }

                return mechanics_events;
            }

            return [...mechanics_events, {
                name: `atb_${this.effect}`,
                payload: {
                    target: target.id,
                    value: config.value,
                }
            }];
        }, []);
    }
}
