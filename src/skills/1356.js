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

// skill id: 1356
/** 
Increases your Attack Bar by 25% each time the enemy's turn ends. [Automatic Effect]  
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: passive skill
        // fixme: End of each enemy turn
        action: [step(targetEnemy), step(targetSelf, atbIncrease(25))],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(1356, spec.meta, multistep(spec.action))
}
