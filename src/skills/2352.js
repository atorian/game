// @flow
import type { Ability } from "../index"
import { step, targetEnemy, debuff, multistep, GenericSkill } from "../skill"

// skill id: 2352
/** 
Attacks with a spinning punch and stuns the enemy for 1 turn with a 50% chance and recovers HP by 20% of inflicted damage. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [step(targetEnemy, debuff(roll, "stun", 1, 50))],
        meta: {
            dmg: 20,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(2352, spec.meta, multistep(spec.action))
}
