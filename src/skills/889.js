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

// skill id: 889
/** 
Decreases the enemy's Attack Bar by 25% and strikes again with a 25% chance. [Automatic Effect] 
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
    return new GenericSkill(889, spec.meta, multistep(spec.action))
}
