// @flow
import type { Ability } from "../index"
import { step, targetAlly, targetSelf, multistep, GenericSkill } from "../skill"

// skill id: 1029
/** 
Revives the target dead ally and fills up its HP to the maximum amount and also revives other dead allies with 30% of their HP. Consumes your HP by half and consumes your HP additionally by 15% per revived ally. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [step(targetAlly), step(targetSelf)],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 6,
        },
    }
    return new GenericSkill(1029, spec.meta, multistep(spec.action))
}
