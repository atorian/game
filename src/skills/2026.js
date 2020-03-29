// @flow
import type { Ability } from "../index"
import { step, targetAlly, targetSelf, multistep, GenericSkill } from "../skill"

// skill id: 2026
/** 
Increases your Attack Bar by 100% if an ally's HP falls below 30% from an attack. [Automatic Effect] 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: passive skill
        // fixme: If HP falls below 30%
        action: [step(targetAlly), step(targetSelf)],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(2026, spec.meta, multistep(spec.action))
}
