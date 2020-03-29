// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemies,
    simpleDmg,
    atbDecrease,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 103
/** 
Brings out some friends to attack the enemies randomly 6 times and decreases their Attack Bar by 20% each. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemies,
                simpleDmg(roll, attacker => attacker.atk * 1.6),
                atbDecrease(roll, undefined),
            ),
            step(
                targetEnemies,
                simpleDmg(roll, attacker => attacker.atk * 1.6),
                atbDecrease(roll, undefined),
            ),
            step(
                targetEnemies,
                simpleDmg(roll, attacker => attacker.atk * 1.6),
                atbDecrease(roll, undefined),
            ),
            step(
                targetEnemies,
                simpleDmg(roll, attacker => attacker.atk * 1.6),
                atbDecrease(roll, undefined),
            ),
            step(
                targetEnemies,
                simpleDmg(roll, attacker => attacker.atk * 1.6),
                atbDecrease(roll, undefined),
            ),
            step(
                targetEnemies,
                simpleDmg(roll, attacker => attacker.atk * 1.6),
                atbDecrease(roll, undefined),
            ),
        ],
        meta: {
            dmg: 30,
            effect: 0,
            cooldown: 4,
        },
    }
    return new GenericSkill(103, spec.meta, multistep(spec.action))
}
