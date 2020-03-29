// @flow
import type { Ability } from "../index"
import { step, targetAllies, multistep, GenericSkill } from "../skill"

// skill id: 1771
/** 
Steals one beneficial effect from the target and applies to all allies after the attack. Also increases your Attack Power by 30% for each beneficial effect you are granted with. [Automatic Effect] 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: passive skill
        // fixme: Applies buff AOE to all allies
        action: [step(targetAllies)],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(1771, spec.meta, multistep(spec.action))
}
