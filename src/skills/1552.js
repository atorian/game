// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemies,
    simpleDmg,
    strip,
    targetSelf,
    atbIncrease,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 1552
/** 
Attacks the surrounding enemies 2 times and removes beneficial effects granted on the enemies with a 50% chance each. Increases your Attack Bar by 10% each when you land a Critical Hit. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemies,
                simpleDmg(roll, attacker => attacker.atk * 1.65),
                strip(roll, 10, 100),
            ),
            step(
                targetEnemies,
                simpleDmg(roll, attacker => attacker.atk * 1.65),
                strip(roll, 10, 100),
            ),
            step(targetSelf, atbIncrease(10)),
        ],
        meta: {
            dmg: 25,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(1552, spec.meta, multistep(spec.action))
}
