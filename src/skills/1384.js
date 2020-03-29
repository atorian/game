// @flow
import type { Ability } from "../index"
import { step, targetSelf, multistep, GenericSkill } from "../skill"

// skill id: 1384
/** 
Your Defense is increased by 25% for every beneficial effect on you and your Attack Speed is increased by 25 for every harmful effect you suffer. [Automatic Effect] 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: passive skill
        action: [step(targetSelf)],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(1384, spec.meta, multistep(spec.action))
}
