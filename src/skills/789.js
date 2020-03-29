// @flow
import type { Ability } from "../index"
import { step, targetAlly, multistep, GenericSkill } from "../skill"

// skill id: 789
/** 
Recovers the HP and Attack Bar of an ally target by 30% each. This skill may revive a dead ally with 30% HP at the cost of 3 additional turns being added to the cool time. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [step(targetAlly)],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 3,
            recovery: 20,
        },
    }
    return new GenericSkill(789, spec.meta, multistep(spec.action))
}
