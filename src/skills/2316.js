// @flow
import type { Ability } from "../index"
import { step, targetSelf, multistep, GenericSkill } from "../skill"

// skill id: 2316
/** 
When your turn ends, you will be turned into a statue until the next turn starts with a 30% chance. You can't get defeated when you are turned into a statue. [Automatic Effect] 
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
    return new GenericSkill(2316, spec.meta, multistep(spec.action))
}
