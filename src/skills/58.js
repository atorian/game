// @flow
import type { Ability } from "../index"
import { step, targetAlly, multistep, GenericSkill } from "../skill"

// skill id: 58
/** 
Decreases the inflicted damage on the ally from Water, Fire, and Wind attributes by 25%. The effect is not accumulated with other decrease damage effects. [Automatic Effect] 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: passive skill
        // fixme: Unknown effect: 59
        action: [step(targetAlly)],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(58, spec.meta, multistep(spec.action))
}
