// @flow
import type {Contestant, Mechanics, Targeted} from '../battle'
import {ActionContext} from "../battle";
import target from "./targeting";
import {Multiplier} from "./enemy-damage";

type ReviveConf = Targeted & {
    heal: string,
}


function configure(conf: string | Object): ReviveConf {
    if (typeof conf === 'string') {
        return {
            heal: conf,
        }
    }

    if (!conf.heal) {
        throw new Error('Revive must have heal value');
    }

    return {
        ...conf,
    }
}


type ReviveEvent = {
    name: 'revive',
    payload: {
        target: string,
        hp: number,
    }
};


export class Revive implements Mechanics {
    multiplier: Multiplier;

    constructor(multiplier: Multiplier) {
        this.multiplier = multiplier;
    }

    apply(context: ActionContext, step: ReviveConf, events?: Event[] = []): ?ReviveEvent[] {
        const config: ReviveConf = configure(step);
        return target(config.target, context).reduce((mechanics_events: [], target: Contestant) => {

            if (target.is_revivable) {
                return [...mechanics_events, {
                    name: 'revived',
                    payload: {
                        target: target.id,
                        hp: this.multiplier.evaluate(config.heal,  {
                            ...context,
                            target
                        })
                    },
                }];
            }

            return [...mechanics_events, {
                name: 'revive_prevented',
                payload: {
                    target: target.id,
                }
            }];

        }, []);
    }
}
