// @flow
import type { Ability } from "../index"
import { step, targetSelf, multistep, GenericSkill } from "../skill"

// skill id: 1383
/** 
Becomes immune against Defense decreasing effects. Your Attack Bar is filled up by 30% each time you get hit by a Critical Hit. [Automatic Effect] 
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
    return new GenericSkill(1383, spec.meta, multistep(spec.action))
}
