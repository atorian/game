// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    simpleDmg,
    atbDecrease,
    targetSelf,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 1257
/** 
Attacks an enemy and decreases its Attack Bar by 10% for each attack. The number of strikes will increase up to 7 hits accordingly to your Attack Speed. The cooldown time for [Blade Dance of the Reaper] won't be activated if the enemy gets defeated. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: Of this skill
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 1.8),
                atbDecrease(roll, undefined),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 1.8),
                atbDecrease(roll, undefined),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 1.8),
                atbDecrease(roll, undefined),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 1.8),
                atbDecrease(roll, undefined),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 1.8),
                atbDecrease(roll, undefined),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 1.8),
                atbDecrease(roll, undefined),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 1.8),
                atbDecrease(roll, undefined),
            ),
            step(targetSelf),
        ],
        meta: {
            dmg: 20,
            effect: 0,
            cooldown: 4,
        },
    }
    return new GenericSkill(1257, spec.meta, multistep(spec.action))
}
