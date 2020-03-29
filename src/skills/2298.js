// @flow
import type { Ability } from "../index"
import { step, targetAlly, multistep, GenericSkill } from "../skill"

// skill id: 2298
/** 
No one can be revived while you are on the battlefield. In addition, the damage you inflict on enemies will be increased by 20% each when an enemy or ally dies. (Accumulates up to 5 times) [Automatic Effect] 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: passive skill
        action: [step(targetAlly)],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(2298, spec.meta, multistep(spec.action))
}
