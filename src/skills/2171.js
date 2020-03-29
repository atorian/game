// @flow
import type { Ability } from "../index"
import { step, targetEnemy, multistep, GenericSkill } from "../skill"

// skill id: 2171
/** 
Attacks the enemy 3 times with spirit balls, having each attack to increase the skill cooldown for 1 turn, and recovers HP by 50% of the inflicted damage. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [step(targetEnemy), step(targetEnemy), step(targetEnemy)],
        meta: {
            dmg: 15,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(2171, spec.meta, multistep(spec.action))
}
