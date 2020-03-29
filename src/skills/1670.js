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

// skill id: 1670
/** 
Increases Defense for 2 turns when you're attacked by an enemy. This effect only activates once a turn. [Automatic Effect] 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: passive skill
        // fixme: When attacked
        action: [
            step(targetEnemy),
            step(
                targetSelf,
                buff((self, target) => target.buf("def", 2)),
            ),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(1670, spec.meta, multistep(spec.action))
}
