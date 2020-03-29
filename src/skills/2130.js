// @flow
import type { Ability } from "../index"
import { step, targetAlly, multistep, GenericSkill } from "../skill"

// skill id: 2130
/** 
Increases the damage to be dealt to an enemy on the next turn by 15% each time an ally is attacked. This effect accumulates up to 5 times and resets after you attack on your turn. [Automatic Effect] 
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
    return new GenericSkill(2130, spec.meta, multistep(spec.action))
}
