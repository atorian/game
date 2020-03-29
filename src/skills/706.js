// @flow
import type { Ability } from "../index"
import { step, targetAlly, multistep, GenericSkill } from "../skill"

// skill id: 706
/** 
Revives a dead ally and evens out the HP ratio of all allies. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [step(targetAlly)],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 5,
        },
    }
    return new GenericSkill(706, spec.meta, multistep(spec.action))
}
