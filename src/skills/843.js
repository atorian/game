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

// skill id: 843
/** 
Increases your Attack Bar by 50% when the enemy target is stunned or defeated after an attack. Deals 100% more damage if the enemy's HP is twice your HP or higher. [Automatic Effect] 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: passive skill
        // fixme: When enemy is stunned or defeated
        action: [step(targetEnemy), step(targetSelf, atbIncrease(50))],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(843, spec.meta, multistep(spec.action))
}
