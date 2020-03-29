// @flow
import type { Ability } from "../index"
import { step, targetEnemy, multistep, GenericSkill } from "../skill"

// skill id: 174
/** 
Attacks the enemy 3 times with spirit balls and recovers HP by 50% of the inflicted damage. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [step(targetEnemy), step(targetEnemy), step(targetEnemy)],
        meta: {
            dmg: 30,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(174, spec.meta, multistep(spec.action))
}
