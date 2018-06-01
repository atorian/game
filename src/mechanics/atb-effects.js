// @flow
import type {ActionContext, System, Targeted, Contestant} from '../battle'
import target from './targeting';
import {TargetModifier} from "../battle";

type AtbStep = {
    atb_boost?: TargetModifier
}

function configure(conf): TargetModifier {
    if (!conf.value) {
        throw new Error('Missing config parameter "value"');
    }
    return conf;
}

export class AtbManipulation implements System {
    apply(context: ActionContext, step: AtbStep, events: Event[]): ?Event[] {
        if (step.atb_boost) {
            const config = configure(step.atb_boost);
            return target(config.target, context).reduce((mechanics_events:[], target:Contestant) => {
                return [...mechanics_events, {
                    name: 'atb_boost',
                    payload: {
                        target: target.id,
                        value: config.value,
                    }
                }];
            }, []);
        }
    }
}
