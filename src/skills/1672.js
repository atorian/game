// @flow
import type { Ability } from "../index"
import {
    step,
    targetAllies,
    targetSelf,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 1672
/** 
Increases your Attack Bar by 15% each when other allies are attacked by the enemies. [Automatic Effect] 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: passive skill
        // fixme: When ally attacked
        action: [step(targetAllies), step(targetSelf)],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(1672, spec.meta, multistep(spec.action))
}
