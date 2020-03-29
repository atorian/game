// @flow
import type { Ability } from "../index"
import { step, targetEnemy, multistep, GenericSkill } from "../skill"

// skill id: 1635
/** 
Rolls 1 dice at the start of each turn. The damage inflicted to the enemy will be increased up to 70% when attacking if the number of the dice is large, and the damage inflicted by the enemy will be reduced up to 70% when attacked if the number of the dice is small. The effect is not accumulated with other decrease damage effects. [Automatic Effect] 
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
    return new GenericSkill(1635, spec.meta, multistep(spec.action))
}
