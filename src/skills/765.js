// @flow
import type { Ability } from "../index"
import { step, targetSelf, multistep, GenericSkill } from "../skill"

// skill id: 765
/** 
Gains immunity against inability effects and decreases the chances of being attacked with a critical hit by 25%. Also increases your Attack Power and Defense by 10% whenever you receive an attack that doesn't land as a Critical Hit. (Accumulates up to 10 times) [Automatic Effect] 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: passive skill
        action: [step(targetSelf)],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(765, spec.meta, multistep(spec.action))
}
