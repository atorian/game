// @flow
import type { Ability } from "../index"
import { step, targetAlly, multistep, GenericSkill } from "../skill"

// skill id: 1002
/** 
Revives a dead ally with little HP and grants a turn instantly. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [step(targetAlly)],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 5,
        },
    }
    return new GenericSkill(1002, spec.meta, multistep(spec.action))
}
