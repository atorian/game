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

// skill id: 1674
/** 
Reflects 30% of the received damage back to the enemy. [Automatic Effect] 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: passive skill
        // fixme: FIXME: Passive DMG reflect
        action: [
            step(targetEnemy),
            step(
                targetSelf,
                buff((self, target) => target.buf("reflectDmg", 30)),
            ),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(1674, spec.meta, multistep(spec.action))
}
