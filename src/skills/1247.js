// @flow
import type { Ability } from "../index"
import {
    step,
    targetAllies,
    simpleDmg,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 1247
/** 
The final battle begins. Both allies and enemies lose 15% of their HP, and the enemies receive massive additional damage. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetAllies,
                simpleDmg(roll, attacker => attacker.atk * 4.5),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 0,
            cooldown: 5,
        },
    }
    return new GenericSkill(1247, spec.meta, multistep(spec.action))
}
