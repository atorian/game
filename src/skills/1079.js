// @flow
import type { Ability } from "../index"
import { step, targetAlly, multistep, GenericSkill } from "../skill"

// skill id: 1079
/** 
Removes all harmful effects of all allies and all ally skills will become instantly available. [Illusion of Time] will not be affected by cooldown reducing or increasing skills. 
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
    return new GenericSkill(1079, spec.meta, multistep(spec.action))
}
