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

// skill id: 1030
/** 
Counterattacks instantly when you or an ally is attacked with a critical hit and increases your Attack Bar by 10%. Increases your Defense by 10% each whenever [Judge (Passive)] is activated. (Accumulates up to 10 times) [Automatic Effect] 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: passive skill
        // fixme: When ally hit with critical
        action: [
            step(
                targetAlly,
                buff((self, target) => target.buf("counterAtk", null)),
            ),
            step(
                targetSelf,
                buff((self, target) => target.buf("counterAtk", null)),
            ),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(1030, spec.meta, multistep(spec.action))
}
