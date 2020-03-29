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

// skill id: 1346
/** 
Deals damage to an enemy and with a 50% chance, decreases its Attack Bar by 30%. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 3.8),
                atbDecrease(roll, undefined),
            ),
        ],
        meta: {
            dmg: 25,
            effect: 30,
            cooldown: 0,
        },
    }
    return new GenericSkill(1346, spec.meta, multistep(spec.action))
}
