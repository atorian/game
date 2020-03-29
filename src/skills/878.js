// @flow
import type { Ability } from "../index"
import { step, targetAllies, multistep, GenericSkill } from "../skill"

// skill id: 878
/** 
Increases the Attack Bar of all allies by 50% each, and reduces the cool time of their skills by 1 turn each. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [step(targetAllies)],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 4,
        },
    }
    return new GenericSkill(878, spec.meta, multistep(spec.action))
}
