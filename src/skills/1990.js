// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemies,
    simpleDmg,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 1990
/** 
Attacks all enemies to increase the enemies' harmful effect duration by 1 turn and decrease the enemies' beneficial effect duration by 1 turn. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: Unknown effect: 60
        // fixme: Unknown effect: 68
        action: [
            step(
                targetEnemies,
                simpleDmg(roll, attacker => attacker.atk * 4),
            ),
        ],
        meta: {
            dmg: 30,
            effect: 0,
            cooldown: 4,
        },
    }
    return new GenericSkill(1990, spec.meta, multistep(spec.action))
}
