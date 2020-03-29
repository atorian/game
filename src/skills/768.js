// @flow
import type { Ability } from "../index"
import { step, targetAlly, multistep, GenericSkill } from "../skill"

// skill id: 768
/** 
Decreases the inflicted damage on you and the recovery amount by 50%. The Attack Power increases by 50% if an enemy or ally dies. Accumulates up to 5 times. [Automatic Effect] 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: passive skill
        action: [step(targetAlly)],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(768, spec.meta, multistep(spec.action))
}
