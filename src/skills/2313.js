// @flow
import type { Ability } from "../index"
import { step, targetAlly, multistep, GenericSkill } from "../skill"

// skill id: 2313
/** 
If your turn ends with 70% or higher HP, you will be turned into a statue until the next turn starts. The damage dealt on allies will be reduced gradually if the ally gets attacked with multiple hits when you are turned into a statue. [Automatic Effect] 
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
    return new GenericSkill(2313, spec.meta, multistep(spec.action))
}
