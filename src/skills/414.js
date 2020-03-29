// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemies,
    debuff,
    atbDecrease,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 414
/** 
Sends out a gust of wind that has a 50% chance to decrease the Attack Bar of all enemies by 30% and decrease their Attack Speed for 2 turns.  
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemies,
                debuff(roll, "slow", 2, 100),
                atbDecrease(roll, undefined),
            ),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(414, spec.meta, multistep(spec.action))
}
