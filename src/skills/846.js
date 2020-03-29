// @flow
import type { Ability } from "../index"
import {
    step,
    targetAlly,
    buff,
    targetSelf,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 846
/** 
The HP ratio of you and the target ally will be evened and both will become invincible for 2 turns. Decreases the cooldown time of [Illusion Magic] for 3 turns if your HP is 50% or lower after balancing the HP ratio. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetAlly,
                buff((self, target) => target.buf("invincibility", 2)),
            ),
            step(
                targetSelf,
                buff((self, target) => target.buf("invincibility", 2)),
            ),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 6,
        },
    }
    return new GenericSkill(846, spec.meta, multistep(spec.action))
}
