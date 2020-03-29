// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    simpleDmg,
    debuff,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 735
/** 
Detonates a frost compressed bomb, dealing damage to all enemies and decreasing their Attack Power and Defense for 2 turns with an 80% chance on each target. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 4.2),
                debuff(roll, "atk_break", 2, 80),
                debuff(roll, "def_break", 2, 80),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 20,
            cooldown: 4,
        },
    }
    return new GenericSkill(735, spec.meta, multistep(spec.action))
}
