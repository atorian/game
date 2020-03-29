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

// skill id: 2358
/** 
The critical rate will be at 100% if the enemy has no harmful effects. Attacks the target one more time with [Energy Punch] when you attack with a critical hit on your turn. [Automatic Effect] 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: passive skill
        // fixme: If target has no debuffs
        action: [
            step(targetEnemy),
            step(
                targetSelf,
                buff((self, target) => target.buf("cr", null)),
            ),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(2358, spec.meta, multistep(spec.action))
}
