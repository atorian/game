// @flow
import type { Ability } from "../index"
import { step, targetAlly, multistep, GenericSkill } from "../skill"

// skill id: 173
/** 
Revives a dead ally target and fills up the ally's HP by 15%. Revives another ally with a 30% chance. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: Up to two allies
        action: [step(targetAlly)],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 6,
        },
    }
    return new GenericSkill(173, spec.meta, multistep(spec.action))
}
