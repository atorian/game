// @flow
import type { Ability } from "../index"
import { step, targetSelf, multistep, GenericSkill } from "../skill"

// skill id: 1339
/** 
Revives with 30% of HP at the last dying breath and fills up the Attack Bar to the fullest amount. The Attack Power also increases by 100% each whenever revived. (Accumulates up to 3 times) [Automatic Effect] 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: passive skill
        action: [step(targetSelf)],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 5,
        },
    }
    return new GenericSkill(1339, spec.meta, multistep(spec.action))
}
