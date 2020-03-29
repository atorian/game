// @flow
import type { Ability } from "../index"
import { step, targetAlly, multistep, GenericSkill } from "../skill"

// skill id: 793
/** 
Removes all harmful effects on an ally target and casts a shield that lasts for 3 turns. The shield amount is proportionate to the Monster's level.  
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [step(targetAlly)],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 3,
            shield: 0.30000000000000004,
        },
    }
    return new GenericSkill(793, spec.meta, multistep(spec.action))
}
