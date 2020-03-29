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

// skill id: 258
/** 
Counterattacks with a 50% chance when an ally is attacked. [Automatic Effect] 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: passive skill
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
    return new GenericSkill(258, spec.meta, multistep(spec.action))
}
