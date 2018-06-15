// @flow
import type {ActionContext, Mechanics, Targeted, Contestant} from '../battle'
import target from './targeting';
import {TargetModifier} from "../battle";

type AtbStep = {
    atb_boost?: TargetModifier
}

function configure(conf: number | Object): TargetModifier {

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
        const config = configure(step);
        return target(config.target, context).reduce((mechanics_events: [], target: Contestant) => {
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
