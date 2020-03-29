// @flow
import type { Ability } from "../index"
import {
    step,
    targetAlly,
    targetSelf,
    onKill,
    additionalTurn,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 1651
/** 
Offsets the incoming damage that may cause your ally to die and instantly gains another turn. [Automatic Effect] 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: passive skill
        // fixme: Unknown effect: 59
        action: [
            step(targetAlly),
            step(targetSelf, onKill(additionalTurn(roll, 100))),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 5,
        },
    }
    return new GenericSkill(1651, spec.meta, multistep(spec.action))
}
