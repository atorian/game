// @flow
import type {Contestant, Effect, Mechanics, Targeted} from '../battle'
import {ActionContext} from "../battle";
import target from "./targeting";
import _ from 'lodash';
import type {ResistPolicy} from "./harmful-effects";
import {VALID_BUFS} from "./beneficial-effects";
import {Multiplier} from "./enemy-damage";

type HealConf = Targeted & {
    value: string,
}


function configure(conf: string | Object): HealConf {
    if (typeof conf === 'string') {
        return {
            target: 'ally',
            value: conf,
        }
    }

    if (!conf.value) {
        throw new Error('Damage must have value');
    }

    return {
        target: 'ally',
        ...conf,
    }
}


type StripEvent = {
    name: 'strip',
    payload: {
        target: string,
        effect: string,
    }
};


export class Heal implements Mechanics {
    multiplier: Multiplier;

    constructor(multiplier: Multiplier) {
        this.multiplier = multiplier;
    }

    apply(context: ActionContext, step: HealConf, events?: Event[] = []): ?StripEvent[] {
        const config: HealConf = configure(step);
        return target(config.target, context).reduce((mechanics_events: [], target: Contestant) => {

            if (target.hp > 0) {

                const is_unrecoverable: boolean = target.effects.filter(e => e.effect === 'unrecoverable').length > 0;

                if (is_unrecoverable) {
                    return [...mechanics_events, {
                        name: 'unrecoverable',
                    }];
                }


                return [...mechanics_events, {
                    name: 'heal',
                    payload: {
                        target: target.id,
                        value: this.multiplier.evaluate(config.value, {
                            ...context,
                            target
                        }),
                    }
                }];
            }

            return mechanics_events;

        }, []);
    }
}
