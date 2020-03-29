// @flow
import type { Ability } from "../index"
import { step, targetEnemy, debuff, multistep, GenericSkill } from "../skill"

// skill id: 1381
/** 
Unleashes a devastating shout which has a 50% chance to provoke the enemy for 1 turn. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [step(targetEnemy, debuff(roll, "provoke", 1, 50))],
        meta: {
            dmg: 0,
            effect: 25,
            cooldown: 3,
        },
    }
    return new GenericSkill(1381, spec.meta, multistep(spec.action))
}
