// @flow
import type { Ability } from "../index"
import { step, targetEnemy, debuff, multistep, GenericSkill } from "../skill"

// skill id: 102
/** 
Unleashes a piercing scream, stunning the enemy and inflicting Continuous Damage for 3 turns. This skill receives 50% additional Accuracy. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                debuff(roll, "stun", 1, 100),
                debuff(roll, "dot", 3, 100),
            ),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(102, spec.meta, multistep(spec.action))
}
