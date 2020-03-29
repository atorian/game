// @flow
import type { Ability } from "../index"
import { step, targetSelf, buff, multistep, GenericSkill } from "../skill"

// skill id: 189
/** 
Gains immunity against freeze and stun effects and increases the recovery amount you receive by 100%. [Automatic Effect] 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: passive skill
        // fixme: Against Freeze and Stun
        action: [
            step(
                targetSelf,
                buff((self, target) => target.buf("immunity", null)),
            ),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(189, spec.meta, multistep(spec.action))
}
