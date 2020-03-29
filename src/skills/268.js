// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemies,
    simpleDmg,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 268
/** 
Attacks all enemies 4 times with a volley of arrows. Each strike has a 75% chance to decrease their Attack Bar by 15%.  
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemies,
                simpleDmg(roll, attacker => attacker.atk * 1),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 10,
            cooldown: 4,
        },
    }
    return new GenericSkill(268, spec.meta, multistep(spec.action))
}
