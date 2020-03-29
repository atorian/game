// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    simpleDmg,
    targetSelf,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 325
/** 
Attacks the enemy with 2 arrows and attacks consecutively with a 30% chance. Attacks consecutively with a 50% chance if the enemy's HP is higher. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 2.4),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 2.4),
            ),
            step(targetSelf),
        ],
        meta: {
            dmg: 25,
            effect: 0,
            cooldown: 2,
        },
    }
    return new GenericSkill(325, spec.meta, multistep(spec.action))
}
