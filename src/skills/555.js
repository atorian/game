// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemies,
    simpleDmg,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 555
/** 
Attacks all enemies 2 times each with burning arrows and inflicts Continuous Damage for 3 turns with a 35% chance on each attack. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemies,
                simpleDmg(roll, attacker => attacker.atk * 2),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 20,
            cooldown: 4,
        },
    }
    return new GenericSkill(555, spec.meta, multistep(spec.action))
}
