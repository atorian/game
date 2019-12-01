import {ActionContext, Event} from "../battle";
import {createResistPolicy} from "./harmful-effects";
import {HarmfulEffectsFactory, roll} from "./index";

export default class RandomHarmfulEffects {
    constructor(harm: HarmfulEffectsFactory) {
        this.harm = harm;
    }
    apply(context: ActionContext, steps: Object[], events?: Event[] = []): Object[] {
        const config = _.sample(steps);
        const debuf = Object.keys(config)[0];
        return this.harm.create(debuf).apply(context, config, events);
    }
}

