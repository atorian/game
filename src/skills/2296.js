// @flow
import type { Ability } from "../index"
import {
    step,
    targetAllies,
    targetSelf,
    atbIncrease,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 2296
/** 
Revives with little HP and fills up your Attack Bar by 100% if allies and enemies act for 12 turns when you are dead. [Automatic Effect] 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: passive skill
        // fixme: On Revive
        action: [step(targetAllies), step(targetSelf, atbIncrease(100))],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(2296, spec.meta, multistep(spec.action))
}
