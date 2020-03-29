// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemies,
    simpleDmg,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 1443
/** 
Attacks all enemies and increases their cooldowns by 1 turn each with a 70% chance. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemies,
                simpleDmg(roll, attacker => attacker.atk * 3.2),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 10,
            cooldown: 3,
        },
    }
    return new GenericSkill(1443, spec.meta, multistep(spec.action))
}
