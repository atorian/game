// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemies,
    targetSelf,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 1081
/** 
Redistributes the HP of all enemies, excluding the Boss, and sacrifices half of your current HP to deal damage proportionate to the sacrificed HP to all enemies. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: Cant parse dmg multiplier: Current HP
        // fixme: Unknown effect: 62
        action: [step(targetEnemies), step(targetSelf)],
        meta: {
            dmg: 20,
            effect: 0,
            cooldown: 4,
        },
    }
    return new GenericSkill(1081, spec.meta, multistep(spec.action))
}
