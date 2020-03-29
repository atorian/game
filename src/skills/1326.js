// @flow
import type { Ability } from "../index"
import { step, targetEnemy, multistep, GenericSkill } from "../skill"

// skill id: 1326
/** 
At the cost of 5% of your current HP, your attacks will deal additional damage based on how much HP you've lost. This effect will only activate on this Monster's turn. [Automatic Effect]  
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: passive skill
        action: [step(targetEnemy)],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(1326, spec.meta, multistep(spec.action))
}
