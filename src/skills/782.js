// @flow
import type { Ability } from "../index"
import { step, targetAlly, multistep, GenericSkill } from "../skill"

// skill id: 782
/** 
Removes 1 beneficial effect each with a 35% chance and recovers the ally with the lowest HP by 15% when you attack on your turn. [Automatic Effect] 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: passive skill
        action: [step(targetAlly)],
        meta: {
            dmg: 0,
            effect: 25,
            cooldown: 0,
            recovery: 30,
        },
    }
    return new GenericSkill(782, spec.meta, multistep(spec.action))
}
