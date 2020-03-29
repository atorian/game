// @flow
import type { Ability } from "../index"
import { step, targetAlly, multistep, GenericSkill } from "../skill"

// skill id: 1447
/** 
Instantly readies all skills of an ally except yourself. [Ventilate] will not be affected by other cooldown reduction or increasing skills. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [step(targetAlly)],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(1447, spec.meta, multistep(spec.action))
}
