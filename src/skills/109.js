// @flow
import type { Ability } from "../index"
import { step, targetEnemy, multistep, GenericSkill } from "../skill"

// skill id: 109
/** 
Bites your enemy and recovers 30% of the inflicted damage. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [step(targetEnemy)],
        meta: {
            dmg: 40,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(109, spec.meta, multistep(spec.action))
}
