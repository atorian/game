// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    simpleDmg,
    atbDecrease,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 831
/** 
Inflicts great damage by slashing the enemy with the energy of the sword and reduces the enemy's Attack Bar by 50%. The damage of this skill increases according to the Attack Speed. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(
                    roll,
                    attacker =>
                        (attacker.atk * 1 * (attacker.atkSpd + 150)) / 50,
                ),
                atbDecrease(roll, undefined),
            ),
        ],
        meta: {
            dmg: 25,
            effect: 0,
            cooldown: 2,
        },
    }
    return new GenericSkill(831, spec.meta, multistep(spec.action))
}
