// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemies,
    simpleDmg,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 780
/** 
Steals the magical power from all enemies, recovering HP according to the damage dealt. Also absorbs 25% of the Attack Bar. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemies,
                simpleDmg(roll, attacker => attacker.atk * 4),
            ),
        ],
        meta: {
            dmg: 45,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(780, spec.meta, multistep(spec.action))
}
