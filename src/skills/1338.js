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

// skill id: 1338
/** 
When you defeat an enemy during your turn, the enemy's soul will be destroyed and will prevent the enemy from being resurrected, and will grant you the Soul Protection for 2 turns. [Automatic Effect] 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: passive skill
        action: [
            step(targetEnemy),
            step(
                targetSelf,
                buff((self, target) => target.buf("soul_protect", 2)),
            ),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(1338, spec.meta, multistep(spec.action))
}
