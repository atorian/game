// @flow
import type { Ability } from "../index"
import { step, targetEnemy, multistep, GenericSkill } from "../skill"

// skill id: 804
/** 
Attacks an enemy 3 times with a shimmering light and recovers HP by 50% of the inflicted damage. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [step(targetEnemy), step(targetEnemy), step(targetEnemy)],
        meta: {
            dmg: 30,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(804, spec.meta, multistep(spec.action))
}
