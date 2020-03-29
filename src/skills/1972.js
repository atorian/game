// @flow
import type { Ability } from "../index"
import { step, targetAlly, multistep, GenericSkill } from "../skill"

// skill id: 1972
/** 
Steals 1 of the beneficial effects granted on the enemy with every attack. The damage will be increased by 10% each up to 15 times whenever this effect occurs. The stolen beneficial effect(s) will also be granted on Chakram Dancer if she's included in the ally team. [Automatic Effect] 
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
    return new GenericSkill(1972, spec.meta, multistep(spec.action))
}
