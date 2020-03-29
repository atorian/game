// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    debuff,
    atbDecrease,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 1370
/** 
Resets the Attack Bar of the enemy target and decreases the Attack Bar of the other enemies by 30% each. Also puts all enemies to sleep for 2 turns. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                debuff(roll, "sleep", 2, 100),
                atbDecrease(roll, undefined),
            ),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 5,
        },
    }
    return new GenericSkill(1370, spec.meta, multistep(spec.action))
}
