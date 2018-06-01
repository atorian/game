// @flow
import type {ActionContext, System, Targeted, Contestant} from '../battle'
import target from './targeting';

// not target as it's only allowed to target ally
type WithValue = {
    value: number,
}

type AtbStep = {
    atb_boost?: Targeted & WithValue
}

function configure(conf): Targeted & WithValue {
    if (!conf.value) {
        throw new Error('Missing config parameter "value"');
    }
    return conf;
}

export class AtbManipulation implements System {
    apply(context: ActionContext, step: AtbStep, events: Event[]): ?Event[] {
        if (step.atb_boost) {
            const config = configure(step.atb_boost);
            return target(config.target, context).map((target:Contestant) => {
                return {
                    name: 'atb_boost',
                    payload: {
                        target: target.id,
                        value: config.value,
                    }
                }
            });
        }
    }
}
