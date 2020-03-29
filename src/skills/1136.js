// @flow
import type { Ability } from "../index"
import { step, targetSelf, multistep, GenericSkill } from "../skill"

// skill id: 1136
/** 
Gains immunity against inability effects and increases your Resistance by 5% and Attack Power by 20% whenever you're attacked. Accumulated up to 10 times. 
[Automatic Effect] 
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
    return new GenericSkill(1136, spec.meta, multistep(spec.action))
}
