// @flow
import type { Ability } from "../index"
import { step, targetAlly, multistep, GenericSkill } from "../skill"

// skill id: 389
/** 
Revives a dead ally and balances the target's HP ratio to half of your HP ratio and recovers the target's HP by 15% each turn for 2 turns. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: Cant parse dmg multiplier: Current HP %,Target MAX HP
        action: [step(targetAlly)],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 6,
        },
    }
    return new GenericSkill(389, spec.meta, multistep(spec.action))
}
