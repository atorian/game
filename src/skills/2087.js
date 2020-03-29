// @flow
import type { Ability } from "../index"
import { step, targetEnemy, multistep, GenericSkill } from "../skill"

// skill id: 2087
/** 
Gains Knowledge by the number of granted beneficial effects when you or an enemy is granted with a beneficial effect. You can have up to 5 Knowledge. [Automatic Effect]  
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: passive skill
        // fixme: Unknown effect: 70
        // fixme: Per beneficial effect granted to self or enemy
        action: [step(targetEnemy)],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(2087, spec.meta, multistep(spec.action))
}
