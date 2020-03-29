// @flow
import type { Ability } from "../index"
import {
    step,
    targetAllies,
    simpleDmg,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 392
/** 
Recovers the HP of all allies, increases the Attack Power and grants immunity for 2 turns. The recovery amount is proportionate to the Attack Power. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetAllies,
                simpleDmg(roll, attacker => attacker.atk * 3),
            ),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 4,
            recovery: 25,
        },
    }
    return new GenericSkill(392, spec.meta, multistep(spec.action))
}
