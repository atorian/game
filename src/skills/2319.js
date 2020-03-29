// @flow
import type { Ability } from "../index"
import { step, targetEnemy, debuff, multistep, GenericSkill } from "../skill"

// skill id: 2319
/** 
Attacks the enemy with claws and disturbs the enemy's HP recovery for 1 turn and recovers HP by 30% of the inflicted damage. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [step(targetEnemy, debuff(roll, "heal_block", 1, 100))],
        meta: {
            dmg: 20,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(2319, spec.meta, multistep(spec.action))
}
