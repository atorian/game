// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    simpleDmg,
    atbDecrease,
    strip,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 2125
/** 
Attacks the enemy with a cannon gun and removes all beneficial effects granted on the target. Afterwards, inflicts damage on all enemies and decreases their Attack Bar by 70%. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 4),
                atbDecrease(roll, undefined),
                strip(roll, 10, 100),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 4),
                atbDecrease(roll, undefined),
                strip(roll, 10, 100),
            ),
        ],
        meta: {
            dmg: 25,
            effect: 0,
            cooldown: 4,
        },
    }
    return new GenericSkill(2125, spec.meta, multistep(spec.action))
}
