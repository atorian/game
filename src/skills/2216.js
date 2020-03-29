// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    simpleDmg,
    strip,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 2216
/** 
Attacks the enemy and removes all beneficial effects on the target. Recovers your Attack Bar by 30% if you attack the enemy with no beneficial effects. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: If no buffs to remove
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 6.5),
                strip(roll, 10, 100),
            ),
        ],
        meta: {
            dmg: 10,
            effect: 0,
            cooldown: 3,
            atbIncrease: 0.1,
        },
    }
    return new GenericSkill(2216, spec.meta, multistep(spec.action))
}
