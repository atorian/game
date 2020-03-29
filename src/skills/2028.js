// @flow
import type { Ability } from "../index"
import { step, targetSelf, multistep, GenericSkill } from "../skill"

// skill id: 2028
/** 
Revives into Beast Form with 30% HP at the moment of death and decreases the cooldown time of the [Forest of Living] by 2 turns. [Automatic Effect] 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: passive skill
        action: [step(targetSelf)],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 9,
        },
    }
    return new GenericSkill(2028, spec.meta, multistep(spec.action))
}
