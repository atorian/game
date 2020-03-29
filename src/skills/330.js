// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    simpleDmg,
    strip,
    targetSelf,
    atbIncrease,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 330
/** 
Attacks the enemy with an arrow to remove 1 beneficial effect granted on the target. Your Attack Bar will be increased by 50% after the attack. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 6),
                strip(roll, 10, 100),
            ),
            step(targetSelf, atbIncrease(50)),
        ],
        meta: {
            dmg: 30,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(330, spec.meta, multistep(spec.action))
}
