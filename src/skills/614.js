// @flow
import type { Ability } from "../index"
import { step, targetEnemy, multistep, GenericSkill } from "../skill"

// skill id: 614
/** 
Provokes the enemy for 2 turns with a 75% chance. Becomes invincible for 1 turn. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [step(targetEnemy)],
        meta: {
            dmg: 0,
            effect: 25,
            cooldown: 4,
        },
    }
    return new GenericSkill(614, spec.meta, multistep(spec.action))
}
