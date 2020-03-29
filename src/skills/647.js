// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemies,
    simpleDmg,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 647
/** 
Attacks all enemies by playing the magic flute and sets their Attack Bar to 0.  
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemies,
                simpleDmg(roll, attacker => attacker.atk * 4.3),
            ),
        ],
        meta: {
            dmg: 30,
            effect: 0,
            cooldown: 5,
        },
    }
    return new GenericSkill(647, spec.meta, multistep(spec.action))
}
