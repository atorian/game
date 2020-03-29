// @flow
import type { Ability } from "../index"
import { step, targetEnemy, multistep, GenericSkill } from "../skill"

// skill id: 573
/** 
Absorbs the Attack Bar by 20% if you attack a monster with same or lower HP status compared to yours. Recovers your HP by 20% of the damage dealt if you attack a monster that has better HP status than yours. [Automatic Effect] 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: passive skill
        // fixme: If target has higher HP %
        // fixme: If target has lower HP %
        action: [step(targetEnemy)],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(573, spec.meta, multistep(spec.action))
}
