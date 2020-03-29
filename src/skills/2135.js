// @flow
import type { Ability } from "../index"
import { step, targetEnemy, multistep, GenericSkill } from "../skill"

// skill id: 2135
/** 
Attacks 2 times with a vampire bat and recovers HP by 30% of the inflicted damage. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [step(targetEnemy), step(targetEnemy)],
        meta: {
            dmg: 30,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(2135, spec.meta, multistep(spec.action))
}
