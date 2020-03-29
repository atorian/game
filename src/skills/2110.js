// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    targetSelf,
    atbIncrease,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 2110
/** 
Increases the Attack Bar by 25% whenever an enemy gains a beneficial effect from a skill. [Automatic Effect] 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: passive skill
        // fixme: When enemy gains buff
        action: [step(targetEnemy), step(targetSelf, atbIncrease(25))],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(2110, spec.meta, multistep(spec.action))
}
