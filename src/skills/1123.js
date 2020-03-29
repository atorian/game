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

// skill id: 1123
/** 
Always gains attribute advantage when attacking an enemy. When you receive fatal attacks, you will be immune to death for 1 turn. [Automatic Effect] 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: passive skill
        // fixme: Element advantage behavior detected: 1123.
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
            cooldown: 10,
        },
    }
    return new GenericSkill(1123, spec.meta, multistep(spec.action))
}
