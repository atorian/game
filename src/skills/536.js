// @flow
import type { Ability } from "../index"
import { step, targetSelf, multistep, GenericSkill } from "../skill"

// skill id: 536
/** 
The Attack Power increases as your HP decreases and your critical rate increases by 30%. The Attack Power increases according to Defense. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [step(targetSelf)],
        meta: {
            dmg: 25,
            effect: 0,
            cooldown: 2,
        },
    }
    return new GenericSkill(536, spec.meta, multistep(spec.action))
}
