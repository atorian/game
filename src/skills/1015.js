// @flow
import type { Ability } from "../index"
import { step, targetAllies, multistep, GenericSkill } from "../skill"

// skill id: 1015
/** 
Your Critical Hits increase the Attack Bars of all allies by 20%. This effect does not have effect on allies that have similar skill effects. [Automatic Effect] 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: passive skill
        action: [step(targetAllies)],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(1015, spec.meta, multistep(spec.action))
}
