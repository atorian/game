// @flow
import type { Ability } from "../index"
import {
    step,
    targetAllies,
    buff,
    targetSelf,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 708
/** 
Decreases the chances of receiving a Critical Hit by 50% and reduces the damage that other allies receive by 15%. Doesn't stack up with other damage reduction effects. [Automatic Effect] 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: passive skill
        // fixme: Unknown effect: 59
        action: [
            step(
                targetAllies,
                buff((self, target) => target.buf("anti_cr", null)),
            ),
            step(
                targetSelf,
                buff((self, target) => target.buf("anti_cr", null)),
            ),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(708, spec.meta, multistep(spec.action))
}
