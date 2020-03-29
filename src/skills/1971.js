// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemies,
    simpleDmg,
    targetSelf,
    atbIncrease,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 1971
/** 
Attacks all enemies to inflict damage that's proportionate to your attack speed and increases your Attack Bar by 10% each when you land a Critical Hit. Chakram Dancer's Attack Bar will increase by 20% each when her attack lands as a Critical Hit while they attack together. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemies,
                simpleDmg(
                    roll,
                    attacker =>
                        (attacker.atk * 1 * (attacker.atkSpd + 150)) / 70,
                ),
            ),
            step(targetSelf, atbIncrease(10)),
        ],
        meta: {
            dmg: 20,
            effect: 0,
            cooldown: 4,
        },
    }
    return new GenericSkill(1971, spec.meta, multistep(spec.action))
}
