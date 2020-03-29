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

// skill id: 2109
/** 
Increases the Attack Bar by 50% each and increases the Attack Power for 1 turn when the enemy's attack lands as a glancing hit. 
[Automatic Effect] 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: passive skill
        // fixme: When received glancing hit
        action: [step(targetEnemy), step(targetSelf, atbIncrease(50))],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(2109, spec.meta, multistep(spec.action))
}
