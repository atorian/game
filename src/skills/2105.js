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

// skill id: 2105
/** 
Attacks the enemy to remove all beneficial effects granted on the target with a 70% chance. The damage increases according the number of beneficial effects removed. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 5),
                strip(roll, 10, 100),
            ),
        ],
        meta: {
            dmg: 25,
            effect: 30,
            cooldown: 3,
        },
    }
    return new GenericSkill(2105, spec.meta, multistep(spec.action))
}
