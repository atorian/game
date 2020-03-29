// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemies,
    simpleDmg,
    atbDecrease,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 1418
/** 
Activates a trap, damaging all enemies and decreasing their Attack Bar by 50% each. Against enemies that are stunned, this attack will decrease the Attack Bar to 0. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: Decrease by 100% if enemy is stunned
        action: [
            step(
                targetEnemies,
                simpleDmg(roll, attacker => attacker.atk * 4.8),
                atbDecrease(roll, undefined),
            ),
        ],
        meta: {
            dmg: 30,
            effect: 0,
            cooldown: 5,
        },
    }
    return new GenericSkill(1418, spec.meta, multistep(spec.action))
}
