// @flow
import type { Ability } from "../index"
import { step, targetSelf, multistep, GenericSkill } from "../skill"

// skill id: 346
/** 
Calls upon the power of the sea to increase the Attack Power and Attack Speed for 3 turns. You instantly gain another turn after using this ability. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [step(targetSelf)],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(346, spec.meta, multistep(spec.action))
}
