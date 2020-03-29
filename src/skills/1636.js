// @flow
import type { Ability } from "../index"
import { step, targetAlly, multistep, GenericSkill } from "../skill"

// skill id: 1636
/** 
Rolls 2 dice at the start of each turn if an ally dies to revive all dead allies if you get the same number. The ally will be revived with more HP as the sum of the numbers increases. [Automatic Effect] 
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
    return new GenericSkill(1636, spec.meta, multistep(spec.action))
}
