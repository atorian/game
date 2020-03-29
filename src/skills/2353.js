// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    simpleDmg,
    atbDecrease,
    targetSelf,
    atbIncrease,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 2353
/** 
Launches 2 consecutive attacks on an enemy, inflicting damage and absorbing the enemy's Attack Bar by 25% with each attack. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 3.9),
                atbDecrease(roll, undefined),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 3.9),
                atbDecrease(roll, undefined),
            ),
            step(targetSelf, atbIncrease(25)),
        ],
        meta: {
            dmg: 20,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(2353, spec.meta, multistep(spec.action))
}
