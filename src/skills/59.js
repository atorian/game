// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    targetSelf,
    buff,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 59
/** 
Reflects 30% of the incoming damage for 3 turns and keeps your HP from falling under 1. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(targetEnemy),
            step(
                targetSelf,
                buff((self, target) => target.buf("endure", 1)),
            ),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 5,
        },
    }
    return new GenericSkill(59, spec.meta, multistep(spec.action))
}
