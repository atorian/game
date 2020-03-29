// @flow
import type { Ability } from "../index"
import { step, targetAllies, multistep, GenericSkill } from "../skill"

// skill id: 1246
/** 
Calls upon the power of the divine shield, gaining immunity against all harmful effects. Additionally, the chance of allies receiving a Critical Hit is reduced by 30%. The effect is not accumulated with other critical hit reduction effects. [Automatic Effect] 
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
    return new GenericSkill(1246, spec.meta, multistep(spec.action))
}
