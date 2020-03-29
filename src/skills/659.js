// @flow
import type { Ability } from "../index"
import { step, targetSelf, multistep, GenericSkill } from "../skill"

// skill id: 659
/** 
Recovers HP by 10% every turn. The recovery effects that you receive increases by 100%. [Automatic Effect] 
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
    return new GenericSkill(659, spec.meta, multistep(spec.action))
}
