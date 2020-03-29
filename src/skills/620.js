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

// skill id: 620
/** 
Attacks the enemy with a strong sonic boom and removes a beneficial effect with a 75% chance. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 4),
                strip(roll, 10, 100),
            ),
        ],
        meta: {
            dmg: 35,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(620, spec.meta, multistep(spec.action))
}
