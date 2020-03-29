// @flow
import type { Ability } from "../index"
import { step, targetEnemy, strip, multistep, GenericSkill } from "../skill"

// skill id: 2317
/** 
Attacks 2 times with a vampire bat, each attack having a 50% chance to remove 1 beneficial effect of the enemy, and recovers HP by 30% of the inflicted damage. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(targetEnemy, strip(roll, 10, 100)),
            step(targetEnemy, strip(roll, 10, 100)),
        ],
        meta: {
            dmg: 30,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(2317, spec.meta, multistep(spec.action))
}
