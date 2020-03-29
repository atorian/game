// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    targetSelf,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 2131
/** 
After attacking an enemy during your turn, attacks the enemy once again with [Fire!] skill. If the enemy is defeated with the first attack, you will attack another enemy with the same skill. [Automatic Effect] 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: passive skill
        action: [step(targetEnemy), step(targetSelf)],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(2131, spec.meta, multistep(spec.action))
}
