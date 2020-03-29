// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    debuff,
    cleanse,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 1652
/** 
Removes a random beneficial effect granted on the enemy every turn and puts the enemy to sleep for 1 turn when the beneficial effect is successfully removed. [Automatic Effect] 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: passive skill
        // fixme: If buff removed
        action: [step(targetEnemy, debuff(roll, "sleep", 1, 100), cleanse(1))],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(1652, spec.meta, multistep(spec.action))
}
