// @flow
import type { Ability } from "../index"
import { step, targetEnemy, multistep, GenericSkill } from "../skill"

// skill id: 256
/** 
Grants Immunity to all harmful effects for 3 turns and reflects 30% of damage back to the enemy. Removes all harmful effects. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [step(targetEnemy)],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(256, spec.meta, multistep(spec.action))
}
