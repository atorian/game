// @flow
import type { Ability } from "../index"
import {
    step,
    targetAllies,
    targetSelf,
    onKill,
    additionalTurn,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 2081
/** 
You can't counterattack or attack together with other allies while the weapon is not in your hand, but offsets the incoming damage that may cause you to die and instantly gains another turn. [Automatic Effect] 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: passive skill
        // fixme: If incoming damage would cause death
        action: [
            step(targetAllies),
            step(targetSelf, onKill(additionalTurn(roll, 100))),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(2081, spec.meta, multistep(spec.action))
}
