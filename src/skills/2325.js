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

// skill id: 2325
/** 
Dashes towards an enemy, inflicting damage 2 times. Each attack decreases the Attack Bar by 15% and has a 40% chance to stun the target for 1 turn. The damage is proportionate to my MAX HP. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                debuff(roll, "stun", 1, 40),
                atbDecrease(roll, undefined),
            ),
            step(
                targetEnemy,
                debuff(roll, "stun", 1, 40),
                atbDecrease(roll, undefined),
            ),
        ],
        meta: {
            dmg: 15,
            effect: 10,
            cooldown: 3,
        },
    }
    return new GenericSkill(2325, spec.meta, multistep(spec.action))
}
