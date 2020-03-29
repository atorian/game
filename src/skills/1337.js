// @flow
import type { Ability } from "../index"
import { step, targetAlly, multistep, GenericSkill } from "../skill"

// skill id: 1337
/** 
On each turn, grants a shield which is equivalent to 20% of your HP and lasts for 2 turns to an ally with the lowest HP ratio. [Automatic Effect] 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: passive skill
        action: [step(targetAlly)],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 0,
            shield: 0.30000000000000004,
        },
    }
    return new GenericSkill(1337, spec.meta, multistep(spec.action))
}
