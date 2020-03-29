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

// skill id: 1419
/** 
When being attacked, the damage you receive will be decreased by half and your Attack Power and Attack Speed will be increased for 1 turn. This effect will only activate once per turn. [Automatic Effect] 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: passive skill
        action: [
            step(targetEnemy),
            step(
                targetSelf,
                buff((self, target) => target.buf("spd", 1)),
                buff((self, target) => target.buf("atk", 1)),
            ),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(1419, spec.meta, multistep(spec.action))
}
