// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    targetSelf,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 2191
/** 
Drops your HP to low amount and charges towards the enemy. Inflicts damage that's proportionate to the HP you consumed. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: Cant parse dmg multiplier: Current HP
        action: [step(targetEnemy), step(targetSelf)],
        meta: {
            dmg: 20,
            effect: 0,
            cooldown: 4,
        },
    }
    return new GenericSkill(2191, spec.meta, multistep(spec.action))
}
