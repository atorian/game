// @flow
import type { Ability } from "../index"
import { step, targetSelf, multistep, GenericSkill } from "../skill"

// skill id: 589
/** 
Increases your Attack Power by 100% and your Attack Power increases additionally as your HP decreases. You won't be able to receive any beneficial effects during battle. [Automatic Effect] 
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
    return new GenericSkill(589, spec.meta, multistep(spec.action))
}
