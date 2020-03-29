// @flow
import type { Ability } from "../index"
import { step, targetEnemy, multistep, GenericSkill } from "../skill"

// skill id: 692
/** 
Increases the Attack Power by 50% if your HP ratio is lower than the target enemy's HP ratio at the moment of attacking, and removes 1 beneficial effect of the enemy if you have less beneficial effects than the enemy. [Automatic Effect]  
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: passive skill
        action: [step(targetEnemy)],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(692, spec.meta, multistep(spec.action))
}
