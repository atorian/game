// @flow
import type { Ability } from "../index"
import { step, targetEnemy, debuff, multistep, GenericSkill } from "../skill"

// skill id: 890
/** 
Attacks the enemy and recovers by 50% of the inflicted damage. Guarantees to stun the target for 1 turn if the enemy is granted with a harmful effect. The inflicted damage will be increased by 50% if the target is immune to stun. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: If target has debuff
        action: [step(targetEnemy, debuff(roll, "stun", 1, 100))],
        meta: {
            dmg: 20,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(890, spec.meta, multistep(spec.action))
}
