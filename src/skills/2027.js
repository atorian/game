// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    atbDecrease,
    targetSelf,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 2027
/** 
Absorbs the enemy's Attack Bar by 15% when you attack on your turn. [Automatic Effect] 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: passive skill
        action: [
            step(targetEnemy, atbDecrease(roll, undefined)),
            step(targetSelf),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(2027, spec.meta, multistep(spec.action))
}
