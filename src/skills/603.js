// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemies,
    simpleDmg,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 603
/** 
Attacks all enemies 4 times by summoning thorny bushes and makes them fall asleep for 1 turn with a 50% chance. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemies,
                simpleDmg(roll, attacker => attacker.atk * 1.1),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 10,
            cooldown: 5,
        },
    }
    return new GenericSkill(603, spec.meta, multistep(spec.action))
}
