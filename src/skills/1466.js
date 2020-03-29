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

// skill id: 1466
/** 
The effect of all Attack Bar increasing skills of both allies and enemies will be decreased by 50%. Your Attack Bar will increase by 20% whenever an enemy uses an Attack Bar increasing skill. This skill will not apply to an opponent that has the same skill or Boss skills. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: passive skill
        // fixme: When any enemy uses ATB increasing skill
        action: [step(targetAllies), step(targetSelf, atbIncrease(20))],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(1466, spec.meta, multistep(spec.action))
}
