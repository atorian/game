// @flow
import type { Ability } from "../index"
import { step, targetAllies, multistep, GenericSkill } from "../skill"

// skill id: 998
/** 
Evenly matches the percentage of the HP of all allies. Additionally, all allies recover 25% of their HP. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: Cant parse heal multiplier
        action: [step(targetAllies)],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 4,
            recovery: 30,
        },
    }
    return new GenericSkill(998, spec.meta, multistep(spec.action))
}
