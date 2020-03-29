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

// skill id: 1559
/** 
Decreases the enemy's Attack Bar by 20% with each attack and weakens the enemy's defense for 1 turn with a 75% chance. [Automatic Effect] 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: passive skill
        action: [
            step(
                targetEnemy,
                debuff(roll, "def_break", 1, 75),
                atbDecrease(roll, undefined),
            ),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(1559, spec.meta, multistep(spec.action))
}
