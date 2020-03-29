// @flow
import type { Ability } from "../index"
import { step, targetAlly, multistep, GenericSkill } from "../skill"

// skill id: 1272
/** 
Removes all harmful effects on an ally target and fills up the ally's Attack Bar. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [step(targetAlly)],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 2,
        },
    }
    return new GenericSkill(1272, spec.meta, multistep(spec.action))
}
