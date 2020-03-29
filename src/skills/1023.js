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

// skill id: 1023
/** 
Attacks with a heavenly sword, removing a beneficial effect on the enemy with a 75% chance. The damage increases according to your Defense. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(
                    roll,
                    attacker => attacker.atk * 1.8 + attacker.def * 2.7,
                ),
                strip(roll, 10, 100),
            ),
        ],
        meta: {
            dmg: 30,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(1023, spec.meta, multistep(spec.action))
}
